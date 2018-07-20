# 1. Set Up Angular and AngularJs Hybrid App

## Scaffold New Project With Angular CLI

```sh
npx @angular/cli new your-project-name
```

Note: Can optionally add `--routing` flag to make part 3 a bit easier

## Install AngularJs, Typings, and Angular Upgrade modules

```sh
npm install --save angular @angular/upgrade
npm install --save-dev @types/angular # optional for nice ts features (like autocomplete)
```

## Add AngularJs Legacy App

_Note: We will only show some important imports in this guide. All other imports can be auto-imported by your IDE. You can also check the source code to see the full file._

[legacy.app.module.ts](../src/app/legacy/legacy.app.module.ts)

```ts
import * as angular from 'angular';

export const legacyApp = angular.module('legacyApp', []);
```

## Add Legacy App Component

This component will be our top level AngularJs Component.

[legacy.app.component.ts](../src/app/legacy/legacy.app.component.ts)

```ts
export const LEGACY_APP_COMP_SELECTOR = 'legacyAppComp';

legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `<h2>Legacy App</h2>`,
  controller: () => console.log('Legacy App Controller'),
});
```

## Upgrade Legacy App Component

[legacy.app.component.upgrade.ts](../src/app/legacy/upgrade/legacy.app.component.upgrade.ts)

```ts
// We upgrade it so we can use it in our Angular app
@Directive({
  selector: 'legacy-app-upgrade' // tslint:disable-line
})
export class LegacyAppUpgradeDirective extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {
    super(LEGACY_APP_COMP_SELECTOR, elementRef, injector);
  }
}
```

## Downgrade the Angular AppComponent

[app.component.downgrade.ts](../src/app/legacy/downgrade/app.component.downgrade.ts)

```ts
// IMPORTANT: This is necessary because:
// "AngularJS is always bootstrapped first and owns the root component."
// See: https://angular.io/api/upgrade/static/UpgradeModule
legacyApp.directive('appRoot',
  downgradeComponent({
    component: AppComponent,
    outputs: ['callback']
  }) as angular.IDirectiveFactory
);
```

## Add Index Files

[legacy/index.ts](../src/app/legacy/index.ts)

```ts
// Import legacy files here
import './legacy.app.component';
import './downgrade';
```

And [legacy/downgrade/index.ts](../src/app/legacy/downgrade/index.ts)

```ts
import './app.component.downgrade';
```

## Update Main.ts

Add the following line to your `main.ts`:

[main.ts](../src/main.ts)

```ts
setAngularJSGlobal(angular); // Make AngularJS avaiable globally
```

## Update App Module

[app.module.ts](../src/app/app.module.ts)

```ts
import './legacy/'; // imported so legacy files are bundled

@NgModule({
  declarations: [
    AppComponent,
    // Import the upgraded legacyApp so Angular knows about it
    // and we can use it in our app component
    LegacyAppUpgradeDirective
  ],
  imports: [
    BrowserModule,
    UpgradeModule // Add this so Angular can use the Upgrade module
  ],
  providers: [],
  // VERY IMPORTANT to change this from `bootstrap` to `entryComponents`!
  // This is so we can manually bootstrap our app
  entryComponents: [ AppComponent ]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) { }

  ngDoBootstrap() {
    // Once Angular bootstrap is complete then we manually bootstrap the AngularJS module
    this.upgrade.bootstrap(document.body, [legacyApp.name], { strictDi: true });

    // Note: The AngualrJs bootstrapping could also be done in the `main.ts`.
    // You may see others do it that way.
  }
 }
```

## Update App Component Template

[app.component.html](../src/app/app.component.html)

```html
<div style="text-align:center">
  <h1>{{ title }}</h1>

  <legacy-app-upgrade></legacy-app-upgrade>
</div>
```

## Run your app

```sh
npm start -- --open
```

Now you should have your hyrbrid app sucessfully running! :)

## Next step

[Part 2: Add UI Router With Config](./part-2.md)
