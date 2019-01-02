# 3. Add Angular Router With Config

## Generate HelloNg Component

```sh
npx ng generate component HelloNg
```

## Generate and update AppRoutingModule

Note: If you initialise an Angular CLI project with the `--routing` flag this will automatically be created for you, so skip this step.

```sh
npx ng generate module routing/app-routing --module=app --flat
```

Once generated, add routes and RouerModule imports and exports.

[app.routing.module.ts](../src/app/routing/app.routing.module.ts)

```ts
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Configure Routes

[app.routing.module.ts](../src/app/routing/app.routing.module.ts)

```ts
const routes: Routes = [
  {
    path: 'hello-ng',
    component: HelloNgComponent
  }
];
```

## Add RouterOutlet to AppComponent template

[app.component.html](../src/app/app.component.html)

```html
<router-outlet></router-outlet>
```

## Problem 1. Navigating to Angular Route Doesnt Work

Navigate to [/hello-ng](http://localhost:4200/hello-ng).

Now, the route doesn't load as you would expect. This is where we have to start hacking.

## Debugging

If you want to debug the routing you can update your `AppRoutingModule` as follows:

[app-routing.module.ts](../src/app/routing/app-routing.module.ts)

```ts
imports: [RouterModule.forRoot(routes,
  { enableTracing: true } // <-- For debugging purposes only. Should be turned off in prod.
)],
```

We can force the Angular Router to kick in by adding a `routerLink` for our new Angular route.

[app.component.html](../src/app/app.component.html)

```html
<nav>
  <a routerLink="/hello-ng">Hello Ng</a>
</nav>
```

If you click that link it should work and you should see some logging in the console. But if you refresh the page the route will not load. The presence of AngularJs UI router is causing Angular router not to work. To fix that, go to the next step.

## Next step

[Part 4: Hacks To Get Hybrid Routing Working](./part-4.md)
