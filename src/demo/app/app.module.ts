import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AuthConfigModule } from "./auth/auth.module";
import { AppRoutingModule } from "./app-routing.module";
import { JsonComponent } from "./pages/demo/standard-json/json.component";
import { JavaComponent } from "./pages/demo/java-language/java.component";
import { PythonComponent } from "./pages/demo/python-language/python.component";

// MONACO EDITOR
import {
  MonacoEditorModule,
  MONACO_PATH,
} from "../../ngx-monaco-editor/src/public_api";

// PRIME_NG

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MenubarModule } from "primeng/menubar";
import { TabMenuModule } from "primeng/tabmenu";
import { ToolbarModule } from "primeng/toolbar";

const PRIME_NG = [
  ButtonModule,
  CardModule,
  DividerModule,
  DropdownModule,
  MenubarModule,
  InputTextModule,
  TabMenuModule,
  ToolbarModule,
];

const DEMOS = [JsonComponent, JavaComponent, PythonComponent];

@NgModule({
  declarations: [AppComponent, ...DEMOS],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AuthConfigModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    ...PRIME_NG,
  ],
  providers: [
    {
      provide: MONACO_PATH,
      useValue: "assets/monaco-editor/dev/vs",
    },
  ],
  exports: [...DEMOS],
  bootstrap: [AppComponent],
})
export class AppModule {}
