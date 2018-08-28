import * as angular from 'angular';
import angularUiRouter from 'angular-ui-router';

export const legacyApp = angular.module('legacyApp', [
  angularUiRouter,
])
.config(['$locationProvider', ($locationProvider) => {
  // Enable HTML 5 mode (so remove the default #/ prefix for routes)
  $locationProvider.html5Mode({ enabled: true, requireBase: false });
}]);
