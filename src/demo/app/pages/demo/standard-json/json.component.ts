import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
    MonacoEditorComponent,
    MonacoEditorConstructionOptions,
    MonacoEditorLoaderService,
  } from "../../../../../ngx-monaco-editor/src/public_api";
import { EXAMPLE_JSON, groovyCode, jsCode, mvelCode, pyCode } from 'src/demo/app/json-examples';
import { FlowXAPI } from 'src/demo/app/utils/flowxAPI';
import { filter, take } from 'rxjs';

@Component({
    selector: 'json-demo',
    templateUrl: './json.component.html',
    styleUrls: ["./json.component.scss"],
})
export class JsonComponent implements OnInit {
    theme = "flowx-light";
    themes = ["vs", "vs-dark", "hc-black", "flowx-light", "flowx-dark"];
    readOnlys = [true, false];

    @ViewChild(MonacoEditorComponent) codeEditor: MonacoEditorComponent;

    options: MonacoEditorConstructionOptions = {
      theme: this.theme,
      readOnly: false,
    };
  
  
    dataModel: any;
  
    private flowxApi: FlowXAPI;
  
    public reactiveForm: UntypedFormGroup;
    displayJson: boolean;
    modelUri: monaco.Uri;
  
    constructor(
      private fb: UntypedFormBuilder,
      private flowxAPI: FlowXAPI,
      private monacoLoader: MonacoEditorLoaderService
    ) {
      this.reactiveForm = this.fb.group({
        code: [EXAMPLE_JSON],
      });
      this.registerJSONValidationSchema();
    }
  
    setOptions(option) {
      this.options = { ...this.options, ...option };
    }
  
    mergeOptions(moreOptions?) {
      return {
        ...this.options,
        ...moreOptions,
      };
    }

    formatCode() {
        this.codeEditor.formatCode();
    }
  
    ngOnInit(): void {
      const token = localStorage.getItem("access_token");
      console.log("access_token", token);
      this.getDataModel()
    }
  
    async getDataModel() {
      this.dataModel = await this.flowxAPI.getProcessDataModelVersionDetails(
        "4357380"
      );
      
    }
  
    async registerJSONValidationSchema() {
      await this.monacoLoader.isMonacoLoaded$
        .pipe(
          filter((isLoaded) => isLoaded),
          take(1)
        )
        .toPromise();
  
      // configure the JSON language support with schemas and schema associations
  
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
      });
    }
  
    public getProcessDataModel = async (
      processVersionId: string
    ): Promise<any | undefined> => {
      const processDataModel =
        await this.flowxApi.getProcessDataModelVersionDetails(processVersionId);
      if (!processDataModel) {
        console.log("Cannot find the process version. Please try again.");
        return Promise.reject(
          "Cannot find the process version. Please try again."
        );
      } else {
        return Promise.resolve(processDataModel);
      }
    };
}