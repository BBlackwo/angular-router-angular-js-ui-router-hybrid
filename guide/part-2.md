# 2. Add UI Router With Config

## Install Angular UI Router

```sh
npm install --save angular-ui-router
```

## Configure LegacyApp Module

[legacy.app.module.ts](../src/app/legacy/legacy.app.module.ts)

```ts
import angularUiRouter from 'angular-ui-router';

export const legacyApp = angular.module('legacyApp', [
  angularUiRouter,
])
.config(['$locationProvider', ($locationProvider) => {
  $locationProvider.html5Mode({ enabled: true, requireBase: false });
}]);
```

## Configure Routes

Create a `legacy/routing` folder for our routes file:

[legacy.routes.ts](../src/app/legacy/routing/legacy.routes.ts)

```ts
legacyApp.config(legacyRoutes);

legacyRoutes.$inject = ['$stateProvider'];
function legacyRoutes($stateProvider) {
  $stateProvider
    .state('HelloAjs', {
      url: '/hello-ajs',
      template: `
        <div class="comp ajs">
          <h3>Hello from AngularJs Route</h3>
        </div>
      `,
    });
}
```

You'll also want an `index.ts` file in that folder to assist importing.

[legacy/routing/index.ts](../src/app/legacy/routing/index.ts)

```ts
import './legacy.routes';
```

And update the `legacy/index` file.

[legacy/index.ts](../src/app/legacy/index.ts)

```ts
import './routing';
```

## Update LegacyApp Component Template

[legacy.app.component.ts](../src/app/legacy/legacy.app.component.ts)

```ts
legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `
    <div class="comp ajs">
      <h2>Legacy App Component</h2>
      <ui-view></ui-view>
    <div>
  `
});
```

## Navigate to route

Navigate to [/hello-ajs](http://localhost:4200/hello-ajs).

Now you should have a your angularJs routing set up!

## Next step

[Part 3: Add Angular Router With Config](./part-3.md)
