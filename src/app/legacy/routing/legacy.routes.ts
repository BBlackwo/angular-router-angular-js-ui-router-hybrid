import { LegacyRouteHelper } from './legacy.route-helper';
import { legacyApp } from '../legacy.app.module';

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

  $urlRouterProvider.otherwise(($injector) => {
    const legacyRouteHelper: LegacyRouteHelper = $injector.get('legacyRouteHelper');
    legacyRouteHelper.handleNgRoute();
  });

}
