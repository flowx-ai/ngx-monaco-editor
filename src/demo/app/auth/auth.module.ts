import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AuthConfig, OAuthModule } from "angular-oauth2-oidc";
import { AuthConfigService } from "./auth.service";
import { OAuthModuleConfig, authConfig } from "./auth.config";
import { environment } from "../../environments/environment";

export function init_app(
  authConfigService: AuthConfigService
): () => Promise<any> {
  return () =>
    authConfigService
      .initAuth()
      .then((value) => console.log("init_app", value));
}

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [`${environment.baseUrl}`],
        sendAccessToken: true,
      },
    }),
  ],
  providers: [
    AuthConfigService,
    { provide: AuthConfig, useValue: authConfig },
    OAuthModuleConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AuthConfigService],
      multi: true,
    },
  ],
})
export class AuthConfigModule {}
