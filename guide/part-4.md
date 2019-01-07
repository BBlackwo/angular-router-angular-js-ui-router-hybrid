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

Navigate to [/hello-ng](http://localhost:4200/hello-ng) then click on the "Hello Ajs" link and you'll end up with both routes showing at the same time.

<img src="https://i.ibb.co/ySTpz8F/Screen-Shot-2019-01-03-at-5-09-44-pm.png" alt="drawing" width="400"/>

## Solution 2: Add Angular Sink Route and setUpLocationSync()

Create a catch all (or sink) route for both the Angular Router that will have an empty template. This will mean when there's a valid AngularJs route the AngularJs router will handle it and the Angular router will show an empty template.

[app-routing.module.ts](../src/app/routing/app-routing.module.ts)

```ts
@Component({selector: 'app-empty', template: ''})
class EmptyComponent {}

const routes: Routes = [
  //...other routes

  // Has to be last once all the other routes haven't matched
  { path: '**', component: EmptyComponent },
];

@NgModule({
  declarations: [EmptyComponent],
  //...other properties
})
```

This stil doesn't solve the problem however, as the Angular Router check is not fired when navigating to an AngularJs route. To fix this we'll add a setUpLocationSync method which will try and navigate to an Angular route every time an AngularJs route loads. If that route is not a valid Angular route, it will show our empty component.

Add the following line to [app.module.ts](../src/app/app.module.ts):

```ts
ngDoBootstrap() {
  // From the docs:
  // History.pushState does not fire onPopState, so the Angular location doesn't detect it.
  // The workaround is to attach a location change listener
  setUpLocationSync(this.upgrade);
}
```

Now navigate to [/hello-ng](http://localhost:4200/hello-ng) then click on the "Hello Ajs" link and the Angular route should clear!

## Problem 3: AngularJs UI View Doesn't Clear

Navigate to [/hello-ajs](http://localhost:4200/hello-ajs) then click on the "Hello Ng" link and you'll end up with both routes showing at the same time (same result as last time). This time it's because the AngularJs router hasn't cleared.

## Solution 3: Conditionally Show the UI View

Here's where it gets complicated. You need to create a few different files. We're going to create some services that will get a list of all the valid Angular routes and then check the current route against that list to see if it's valid. The only reason we need to do this is to **handle invalid routes**. If you _don't_ need to do this, just use **Alternative 1**.

[route-helper.ts](../src/app/routing/route-helper.ts)

```ts
export class RouteHelper {
  completeRoutes: Array<string>;

  init(appRoutes: Routes) {
    this.createCompleteRoutes(appRoutes);
  }

  private getChildren(parentPath: string, children: Routes) {
    if (children) {
      children.forEach((child) => {
        if (child.children) {
          const newParentPath = child.path ? `${parentPath}/${child.path}` : parentPath;
          this.getChildren(newParentPath, child.children);
        } else {

          if (!child.path) {
            return this.completeRoutes.push(parentPath);
          }

          this.completeRoutes.push(`${parentPath}/${child.path}`);
        }
      });
    } else {
      this.completeRoutes.push(parentPath);
    }
  }

  /**
   * Creates a flat list of routes based on the
   * defined parent/child routes
   */
  private createCompleteRoutes(appRoutes: Routes): void {
    this.completeRoutes = [];
    appRoutes.forEach((parent) => {
      this.getChildren(parent.path, parent.children);
    });
    this.completeRoutes = this.completeRoutes
      .filter((route) => route !== '**') // remove sink route
      .map(route => `/${route}`);
  }

  getCompleteRoutes(): Array<string> {
    return this.completeRoutes;
  }

  /**
   * Checks if url is in list of complete routes
   */
  isValidRoute(url: string): boolean {
    if (!this.completeRoutes) {
      throw Error('Must call init() first');
    }

    const isUrlInRoutes = this.completeRoutes.includes(url);
    if (isUrlInRoutes) { return isUrlInRoutes; }

    return this.completeRoutes.reduce((accumulator, route) => {
      return accumulator || this.isParameterisedUrlMatched(url, route);
    }, false);
  }

  /**
   * Determines whether the URL matches a route with parameters.
   * When exact URL matches aren't enough.
   */
  isParameterisedUrlMatched(url, route): boolean {
    /**
     * Generates a regular expression pattern as a string based on the route path.
     * Path segments which are recognised as a parameter are replaced with a pattern
     * which matches any value for that segment.
     *
     * See unit tests for examples :)
     */
    const pattern = route
      .split('/')
      .map((segment) => segment.includes(':') ? `[^\\/]+` : segment)
      .join('\\/');

    const regex = new RegExp(`^${pattern}$`);
    return regex.test(url);
  }
}

export const routeHelper = new RouteHelper();
```

Initialise the route helper in the [app-routing.module.ts](../src/app/routing/app-routing.module.ts):

```ts
export class AppRoutingModule {
  constructor() {
    routeHelper.init(routes);
  }
}
```

Add a method to [legacy.route-helper.ts](../src/app/legacy/routing/legacy.route-helper.ts):

```ts
ajsShouldHandleRoute(): Boolean {
  return !routeHelper.isValidRoute(this.$location.path());
}
```

Now create a [legacy.app.controller.ts](../src/app/legacy.app.controller.ts)

```ts
export class LegacyAppController {
  static $inject = ['legacyRouteHelper'];
  constructor(private legacyRouteHelper: LegacyRouteHelper) {}

  ajsShouldHandleRoute(): Boolean {
    return this.legacyRouteHelper.ajsShouldHandleRoute();
  }
}
```

Now add the controller to our [legacy.app.component.ts](../src/app/legacy.app.component.ts) and update the template:

```ts
legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `<ui-view ng-if="$ctrl.ajsShouldHandleRoute()"></ui-view>`,
  controller: LegacyAppController,
});
```

Now navigate to [/hello-ajs](http://localhost:4200/hello-ajs) then click on the "Hello Ng" link and the AngularJs route should clear :)

## Handle Invalid Routes

Usually you will want to redirect a user if they hit an invalid route. We will now implemenet that feature in [legacy-routes.ts](../src/app/legacy/routing/legacy.routes.ts)

```ts
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
```

Now if you navigate to [/invalid-route](http://localhost:4200/invalid-route) it will automatically redirect you to [/hello-ajs](http://localhost:4200/hello-ajs).

<!-- ******************************************* -->

## Alternatives

There are alternative ways to solve the hybrid routing issue each with different pros and cons. Here are two:

### Alternative 1: Create Catch All (Sink) Routes

Create a catch all (or sink) route for both the AngularJs UI Router and Angular Router that will have an empty template. This will mean when there's a valid Angular route the Angular router will handle it and the AngularJs router will show an empty template and vice versa.

In Angular it would be the same as we did before (See **Solution 2**). And in AngularJs:

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

#### Pros

- Easy to set up
- Easy to understand

#### Cons

- You cannot catch invalid routes to redirect the user

## Alternative 2: Add Angular Custom UrlHandlingStrategy

Another option instead of a sink route in Angular is to create a custom `UrlHandlingStrategy`.

From the docs on [UrlHandlingStrategy > shouldProcessUrl()](https://angular.io/api/router/UrlHandlingStrategy#shouldprocessurl):

> When it returns true, the router will execute the regular navigation. When it returns false, the router will set the router state to an empty state. As a result, all the active components will be destroyed.

[app-url-handling-strategy.ts](../src/app/routing/app-url-handling-strategy.ts)

```ts
export class AppUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url) {
    // This is a short term solution - especially if you have a lot of routes
    return url.toString().startsWith('/hello-ng');
  }
  extract(url) { return url; }
  merge(url) { return url; }
}
```

Add the `AppUrlHandlingStrategy` provider to your `AppRoutingModule` in [app-routing.module.ts](../src/app/routing/app-routing.module.ts).

```ts
@NgModule({
  //...
  providers: [
    { provide: UrlHandlingStrategy, useClass: AppUrlHandlingStrategy },
  ],
})
```

And for AngularJs you can just use a sink route as shown in **Alternative 1**.

#### Pros

- More powerful

#### Cons

- Difficult to set up
- You cannot catch invalid routes to redirect the user

## Next step

[Conclusion](./conclusion.md)

## Further Reading

- <https://blog.nrwl.io/upgrading-angular-applications-managing-routers-and-url-ca5588290aaa>
