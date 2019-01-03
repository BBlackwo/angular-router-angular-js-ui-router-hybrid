# 4. Hacks To Get Hybrid Routing Working

## Downgrade the Router service to use in AngularJs

The first step is to downgrade the Router service so we can use it in AngularJs. We can add other downgraded services here too later.

[services.downgrade.ts](../src/app/legacy/downgrade/services.downgrade.ts)

```ts
legacyApp.factory('router', downgradeInjectable(Router));
```

And update the [legacy/downgrade/index.ts](../src/app/legacy/downgrade/index.ts) file.

```ts
import './services.downgrade.ts';
```

## Create AngularJs Legacy Route Helper

Create a service that will get the current path and try and route to that path using the Angular router service we just downgraded.

[legacy.route-helper.ts](../src/app/legacy/routing/legacy.route-helper.ts)

```ts
export class LegacyRouteHelper {
  static $inject = [
    '$location',
    'router',
  ];
  constructor(
    private $location,
    private router: Router,
  ) {}

  handleNgRoute(): void {
    const path = this.$location.path();
    path && this.router.navigateByUrl(path);
  }
}

legacyApp.service('legacyRouteHelper', LegacyRouteHelper);
```

And update the [legacy/routing/index.ts](../src/app/legacy/routing/index.ts) file.

```ts
import './legacy.route-helper.ts';
```

## Solution 1. Configure AngularJs Otherwise Handler

Now we configure a handler in AngularJs for any non-AngularJs routes to try and route to them using the helper we just created.

[legacy.routes.ts](../src/app/legacy/routing/legacy.routes.ts)

```ts
legacyRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
function legacyRoutes($stateProvider, $urlRouterProvider) {
  // ...

  $urlRouterProvider.otherwise(($injector) => {
    const legacyRouteHelper: LegacyRouteHelper = $injector.get('legacyRouteHelper');
    legacyRouteHelper.handleNgRoute();
  });
}
```

You should *now* be able to navigate to [/hello-ng](http://localhost:4200/hello-ng) and it should work!

## Clean Things Up

Let's remove our headings, apply the styles, and add a few links to be able to test some other scenarios we need to solve for.

[legacy.routes.ts](../src/app/legacy/routing/legacy.routes.ts)

```ts
.state('helloAjs', {
  url: '/hello-ajs',
  template: `
    <div class="comp ajs">
      <h3>Hello from AngularJs Route</h3>
      <a href="/hello-ng">Hello Ng</a>
    </div>
  `,
});
```

[legacy.app.component.ts](../src/app/legacy/legacy.app.component.ts)

```ts
legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `<ui-view></ui-view>`,
});
```

[hello-ng.component.html](../src/app/hello-ng/hello-ng.component.html)

```html
<div class="comp ng">
  <h3>Hi from Angular</h3>
  <a href="/hello-ajs">Hello Ajs</a>
</div>
```

[app.component.html](../src/app/app.component.html)

```html
<div style="text-align:center">
  <router-outlet></router-outlet>
  <legacy-app-upgrade></legacy-app-upgrade>
</div>
```

[index.html](../src/index.html)

```html
<body>
  <app-root></app-root>
</body>
```

## Problem 2: Angular RouterOutlet Doesn't Clear

<!-- ... -->

## 4.x. Alternatives

There are alternative ways to solve the hybrid routing issue:

### 4.x.1. Create Catch All Routes

Create a catch all (or "sink") route for both the AngularJs UI Router and Angular Router that will have an empty template. This will mean when there's a valid Angular route the Angular router will handle it and the AngularJs router will show an empty template. Alternatively, if there's a valid AngularJs route the AngularJs router will handle it and the Angular router will show an empty template.

This would look like this in Angular:

```ts
@Component({selector: 'empty', template: ''})
class EmptyComponent {}

@NgModule({
  // ...other imports
  imports: [
    RouterModule.forRoot([
      // ...other routes

      // The catch all route has to come LAST
      { path: '**', component: EmptyComponent }
    ])
  ]
})
```

And in AngularJs:

```ts
$stateProvider
  // ...other states

  // The catch all route has to come LAST
  .state('catchAll', {
    url: '*path',
    template: '',
    controller: () => { /*...Code to route using Angular router*/ }
  });
```

#### 4.x.1 Pros

- Easy to set up
- Easy to understand

#### 4.x.1 Cons

- You cannot catch invalid routes to redirect the user

### 4.x.2. Create Catch All AngularJs Route and Angular UrlHandlingStrategy

Do the same catch all route in AngularJs as above, but use a UrlHandlingStrategy in Angular

```ts
class AppUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url) {
    // This is a simple example where you've prefixed angular routes with `/a/`
    // You could also use the AppUrlHandlingStragegy we created earlier
    return url.toString().startsWith("/a/");
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      // ...routes
    ])
  ],
  providers: [
    { provide: UrlHandlingStrategy, useClass: AppUrlHandlingStrategy }
  ],
})
```

#### 4.x.2 Pros

- Not too hard to set up
- Not too hard to understand
- More configurable than just using a catch all route

#### 4.x.2 Cons

- You cannot catch invalid routes to redirect the user (as before)

## Next step

Conclusion???

## Further Reading

- <https://blog.nrwl.io/upgrading-angular-applications-managing-routers-and-url-ca5588290aaa>
