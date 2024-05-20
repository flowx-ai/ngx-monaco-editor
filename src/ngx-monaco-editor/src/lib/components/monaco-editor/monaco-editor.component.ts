import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  SimpleChanges,
  Output,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  NG_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { filter, take } from "rxjs/operators";

import { MonacoEditorLoaderService } from "../../services/monaco-editor-loader.service";
import {
  MonacoEditorConstructionOptions,
  MonacoEditorUri,
  MonacoStandaloneCodeEditor,
} from "../../interfaces";

@Component({
  selector: "ngx-monaco-editor",
  template: `<div #container class="editor-container">
    <div #editor class="monaco-editor"></div>
  </div>`,
  styles: [
    `
      :host {
        height: 100%;
      }
      .monaco-editor {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .editor-container {
        overflow: hidden;
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        min-width: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true,
    },
  ],
})
export class MonacoEditorComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator
{
  @Input() options: MonacoEditorConstructionOptions;
  @Input() uri?: MonacoEditorUri;
  @Input() dataModel: any;
  @Output() init: EventEmitter<MonacoStandaloneCodeEditor> = new EventEmitter();
  @ViewChild("editor", { static: true }) editorContent: ElementRef;

  editor: MonacoStandaloneCodeEditor;
  completionItemProvider: monaco.IDisposable;
  modelUriInstance: monaco.editor.ITextModel;
  value: string;
  parsedError: MonacoError[] | void[] = [];

  private onTouched: () => void = () => {};
  private onErrorStatusChange: () => void = () => {};
  private propagateChange: (_: any) => any = () => {};

  get model() {
    return this.editor && this.editor.getModel();
  }

  get modelMarkers() {
    return (
      this.model &&
      monaco.editor.getModelMarkers({
        resource: this.model.uri,
      })
    );
  }

  constructor(private monacoLoader: MonacoEditorLoaderService) {}

  ngOnInit() {
    this.monacoLoader.isMonacoLoaded$
      .pipe(
        filter((isLoaded) => isLoaded),
        take(1)
      )
      .subscribe(() => {
        this.initEditor();
      });
  }

  formatCode() {
    setTimeout(() => {
      this.editor.getAction("editor.action.formatDocument").run();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.editor && changes.options && !changes.options.firstChange) {
      const {
        language: toLanguage,
        theme: toTheme,
        ...options
      } = changes.options.currentValue;
      const { language: fromLanguage, theme: fromTheme } =
        changes.options.previousValue;

      if (fromLanguage !== toLanguage) {
        monaco.editor.setModelLanguage(
          this.editor.getModel(),
          this.options && this.options.language ? this.options.language : "text"
        );
      }

      if (fromTheme !== toTheme) {
        monaco.editor.setTheme(toTheme);
      }

      this.editor.updateOptions(options);
    }

    if (this.editor && changes.dataModel && !changes.dataModel.firstChange) {
      this.registerIntelliSense(changes.dataModel.currentValue);
    }

    if (this.editor && changes.uri) {
      const toUri = changes.uri.currentValue;
      const fromUri = changes.uri.previousValue;

      if (
        (fromUri && !toUri) ||
        (!fromUri && toUri) ||
        (toUri && fromUri && toUri.path !== fromUri.path)
      ) {
        const value = this.editor.getValue();

        if (this.modelUriInstance) {
          this.modelUriInstance.dispose();
        }

        let existingModel;

        if (toUri) {
          existingModel = monaco.editor
            .getModels()
            .find((model) => model.uri.path === toUri.path);
        }

        this.modelUriInstance = existingModel
          ? existingModel
          : monaco.editor.createModel(
              value,
              this.options.language || "text",
              this.uri
            );

        this.editor.setModel(this.modelUriInstance);
        this.validateDataModelFormat(this.modelUriInstance);
        this.modelUriInstance.onDidChangeContent(() => {
          this.validateDataModelFormat(this.modelUriInstance);
        });
      }
    }
  }

  validateDataModelFormat(model) {
    const markers = [];
    // lines start at 1
    for (let i = 1; i < model.getLineCount() + 1; i++) {
      const range = {
        startLineNumber: i,
        startColumn: 1,
        endLineNumber: i,
        endColumn: model.getLineLength(i) + 1,
      };
      const content = model.getValueInRange(range).trim();
      const number = Number(content);
      if (Number.isNaN(number)) {
        markers.push({
          message: "not a number",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn,
        });
      } else if (!Number.isInteger(number)) {
        markers.push({
          message: "not an integer",
          severity: monaco.MarkerSeverity.Warning,
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn,
        });
      }
    }
    monaco.editor.setModelMarkers(model, "owner", markers);
  }

  writeValue(value: string): void {
    this.value = value;
    if (this.editor && value) {
      this.editor.setValue(value);
    } else if (this.editor) {
      this.editor.setValue("");
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(): ValidationErrors {
    return !this.parsedError
      ? null
      : {
          monaco: {
            value: this.parsedError,
          },
        };
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onErrorStatusChange = fn;
  }

  flattenNestedObjects(objects, parentPath = "") {
    let flattened = [];
    objects.forEach((obj) => {
      // Create a key for the current object. If there's a parent path, append the current name to it. Otherwise, the key is just the current name.
      const key = parentPath ? `${parentPath}.${obj.name}` : obj.name;
      // If there's a parentPath, it means the current object is not at the root, so include the parent property. Otherwise, don't.
      const flattenedObject = parentPath
        ? {
            key: obj.name,
            parent: parentPath,
            type: obj.type,
            description: obj.description,
            useInReporting: obj.useInReporting,
          }
        : {
            key: obj.name,
            type: obj.type,
            description: obj.description,
            useInReporting: obj.useInReporting,
          };
      flattened.push(flattenedObject);
      // If the current object has properties, recursively flatten them. The current key becomes the parentPath for its properties.
      if (obj.properties && obj.properties.length > 0) {
        flattened = flattened.concat(
          this.flattenNestedObjects(obj.properties, key)
        );
      }
    });
    return flattened;
  }
  groupByParent(entries) {
    return entries.reduce((acc, entry) => {
      // Use 'root' for entries without a parent
      const groupName = entry.parent || "root";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(entry);
      return acc;
    }, {});
  }

  registerIntelliSense(dataModel): void {
    const flatten = this.flattenNestedObjects(dataModel.properties);
    const grouped = this.groupByParent(flatten);

    if (!!this.completionItemProvider) this.completionItemProvider.dispose();

    console.log("this.options", this.options);

    switch (this.options.language) {
      case "json":
        this.completionItemProvider =
          monaco.languages.registerCompletionItemProvider("json", {
            provideCompletionItems: function (model, position) {
              try {
                var currentWord = model.getWordUntilPosition(position);
                var range = {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: currentWord.startColumn,
                  endColumn: currentWord.endColumn,
                };
                const roots = { suggestions: [] };
                if (grouped["root"]) {
                  const rootList = grouped["root"];
                  rootList.forEach((property) => {
                    const parentCompletion = {
                      kind: monaco.languages.CompletionItemKind.Property,
                      insertText: property.key,
                      label: property.key,
                      detail: "Type: " + property.type,
                      documentation:
                        "Press `.` to get `" +
                        property.key +
                        ".`\n Type: " +
                        property.type,
                      range: range,
                    };
                    roots.suggestions.push(parentCompletion);
                  });
                }
                const childs = { suggestions: [] };
                for (const key in grouped) {
                  if (key !== "root") {
                    if (
                      currentWord.word.endsWith(key + ".") ||
                      currentWord.word.indexOf(key) >= 0
                    ) {
                      const propertyList = grouped[key];
                      propertyList.forEach((property) => {
                        const completion = {
                          kind: monaco.languages.CompletionItemKind.Field,
                          insertText: property.parent + "." + property.key,
                          label: property.parent + "." + property.key,
                          detail: "Type: " + property.type,
                          documentation:
                            "Press `.` to get `" +
                            property.key +
                            ".`\n Description: " +
                            (property.description ||
                              "No description provided") +
                            ".`\n Type: " +
                            property.type,
                          range: range,
                        };
                        childs.suggestions.push(completion);
                      });
                    }
                  }
                }

                if (childs.suggestions.length > 0) {
                  return childs;
                } else {
                  return roots;
                }
              } catch (error) {
                console.log("ERROR", error);
                return { suggestions: [] };
              }
            },
          });
        break;
      case "java":
        this.completionItemProvider =
          monaco.languages.registerCompletionItemProvider("java", {
            provideCompletionItems: function (model, position) {
              try {
                var currentWord = model.getWordUntilPosition(position);
                var range = {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: currentWord.startColumn,
                  endColumn: currentWord.endColumn,
                };
                const roots = { suggestions: [] };
                if (grouped["root"]) {
                  const rootList = grouped["root"];
                  rootList.forEach((property) => {
                    const parentCompletion = {
                      kind: monaco.languages.CompletionItemKind.Property,
                      insertText: property.key,
                      label: property.key,
                      detail: "Type: " + property.type,
                      documentation:
                        "Press `.` to get `" +
                        property.key +
                        ".`\n Type: " +
                        property.type,
                      range: range,
                    };
                    roots.suggestions.push(parentCompletion);
                  });
                }
                const childs = { suggestions: [] };
                for (const key in grouped) {
                  if (key !== "root") {
                    if (
                      currentWord.word.endsWith(key + ".") ||
                      currentWord.word.indexOf(key) >= 0
                    ) {
                      const propertyList = grouped[key];
                      propertyList.forEach((property) => {
                        const completion = {
                          kind: monaco.languages.CompletionItemKind.Field,
                          insertText: property.parent + "." + property.key,
                          label: property.parent + "." + property.key,
                          detail: "Type: " + property.type,
                          documentation:
                            "Press `.` to get `" +
                            property.key +
                            ".`\n Description: " +
                            (property.description ||
                              "No description provided") +
                            ".`\n Type: " +
                            property.type,
                          range: range,
                        };
                        childs.suggestions.push(completion);
                      });
                    }
                  }
                }

                if (childs.suggestions.length > 0) {
                  return childs;
                } else {
                  return roots;
                }
              } catch (error) {
                console.log("ERROR", error);
                return { suggestions: [] };
              }
            },
          });
        break;
      default:
        break;
    }
  }

  private initEditor() {
    monaco.editor.defineTheme("flowx-light", {
      base: "vs", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
        {
          token: "comment",
          foreground: "ff0000",
          fontStyle: "bold",
        },
        {
          token: "datasource",
          foreground: "feb913",
          fontStyle: "underline bold",
        },
        {
          token: "delimiter.datasource",
          foreground: "feb913",
          fontStyle: "underline bold",
        },
      ],
      colors: {},
    });

    monaco.editor.defineTheme("flowx-dark", {
      base: "vs-dark", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
        {
          token: "comment",
          foreground: "ff0000",
          fontStyle: "bold",
        },
        {
          token: "datasource",
          foreground: "feb913",
          fontStyle: "underline bold",
        },
        {
          token: "delimiter.datasource",
          foreground: "feb913",
          fontStyle: "underline bold",
        },
      ],
      colors: {},
    });

    const options: MonacoEditorConstructionOptions = {
      value: [this.value].join("\n"),
      language: "text",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      theme: "flowx-light",
      suggest: {
        snippetsPreventQuickSuggestions: false,
      },
    };

    this.editor = monaco.editor.create(
      this.editorContent.nativeElement,
      this.options ? { ...options, ...this.options } : options
    );

    this.registerEditorListeners();

    this.init.emit(this.editor);
  }

  registerEditorListeners() {
    this.editor.onDidChangeModelContent(() => {
      this.propagateChange(this.editor.getValue());
    });

    this.editor.onDidChangeModelDecorations(() => {
      const currentParsedError: MonacoError[] | void[] = this.modelMarkers.map(
        (marker) => {
          const error: MonacoError = {
            message: marker.message,
            startLineNumber: marker.startLineNumber,
            startColumn: marker.startColumn,
            endLineNumber: marker.endLineNumber,
            endColumn: marker.endColumn,
          };
          return error;
        }
      );
      const hasValidationStatusChanged =
        this.parsedError !== currentParsedError;

      if (hasValidationStatusChanged) {
        this.parsedError = currentParsedError;
        this.onErrorStatusChange();
      }
    });

    this.editor.onDidBlurEditorText(() => {
      this.onTouched();
    });
  }

  ngOnDestroy() {
    this.completionItemProvider.dispose();
    if (this.editor) {
      this.editor.dispose();
      this.editor = undefined;
    }
  }
}

export interface MonacoError {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}
