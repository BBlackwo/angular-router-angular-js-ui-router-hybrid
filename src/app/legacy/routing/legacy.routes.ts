import { legacyApp } from '../legacy.app.module';

legacyApp.config(legacyRoutes);

legacyRoutes.$inject = ['$stateProvider'];
function legacyRoutes($stateProvider) {

  $stateProvider
    .state('helloAjs', {
      url: '/hello-ajs',
      template: `
        <div class="comp ajs">
          <h3>Hello from AngularJs Route</h3>
        </div>
      `,
    });

}
