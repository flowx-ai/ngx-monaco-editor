// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://admin.beta.flowxai.dev',

  keycloak: {
    /**
     * KEYCLOCK Options
     *
     * DEVMAIN : https://auth.devmain.flowxai.dev/auth/realms/paperflow
     * PREVIEW ENV: 'https://auth-pr{{ pull_request_id }}.dev2.flowxai.dev/auth/realms/flowx',
     * QA: https://auth.qa.flowxai.dev/auth/realms/paperflow
     */
    // Url of the Identity Provider
    issuer: 'https://auth.beta.flowxai.dev/auth/realms/flowx', // 671
    // URL of the SPA to redirect the user to after login
    redirectUri: 'http://localhost:4200/',

    // The SPA's id.
    // The SPA is registerd with this id at the auth-serverß

    clientId: 'flowx-platform-authenticate',
    responseType: 'code',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    scope: 'openid profile email offline_access',
    // Remove the requirement of using Https to simplify the demo
    // THIS SHOULD NOT BE USED IN PRODUCTION
    // USE A CERTIFICATE FOR YOUR IDP
    // IN PRODUCTION
    requireHttps: 'true', 
    showDebugInformation: 'false',
    disableAtHashCheck: 'false',
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
