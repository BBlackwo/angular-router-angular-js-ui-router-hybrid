import { LegacyRouteHelper } from './legacy.route-helper';
import { legacyApp } from '../legacy.app.module';
import { routeHelper } from 'src/app/routing/route-helper';

legacyApp.config(legacyRoutes);

legacyRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
function legacyRoutes($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('helloAjs', {
      url: '/hello-ajs',
      template: `
        <div class="comp ajs">
          <h3>Hello from AngularJs Route</h3>
          <a href="/hello-ng">Hello Ng</a>
        </div>
      `,
    });

  $urlRouterProvider.otherwise(($injector, $location) => {
    // If it's a valid Angular Route, Angular will handle it.
    if (routeHelper.isValidRoute($location.path())) {
      const legacyRouteHelper: LegacyRouteHelper = $injector.get('legacyRouteHelper');
      return legacyRouteHelper.handleNgRoute();
    }

    // If it's not a valid route in Angular (or AngularJs cause we're in the $otherwise fn),
    // redirect to our default page
    $location.path('/hello-ng');
  });

}
