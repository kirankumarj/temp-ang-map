// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  isDataAvailableInRealService: false,
  production: false,
  findMapLocationBySearchDataURL : 'http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=',
  findMapLocationBySearchLLURL : 'https://nominatim.openstreetmap.org/reverse?format=json&lat='
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
