import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotfoundComponent } from "./pages/notfound/notfound.component";
import { JsonComponent } from "./pages/demo/standard-json/json.component";
import { AppComponent } from "./app.component";
import { JavaComponent } from "./pages/demo/java-language/java.component";
import { PythonComponent } from "./pages/demo/python-language/python.component";

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: "demo",
          component: AppComponent,
          data: { ai: true },
          children: [
            {
              path: "json",
              component: JsonComponent,
            },
            {
              path: "java",
              component: JavaComponent,
            },
            {
              path: "python",
              component: PythonComponent,
            },
          ],
        },
        { path: "", redirectTo: "/demo/json", pathMatch: "full" },
        { path: "notfound", component: NotfoundComponent },
        { path: "**", redirectTo: "/notfound" },
      ],
      {
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled",
        onSameUrlNavigation: "reload",
        useHash: false,
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
3;
