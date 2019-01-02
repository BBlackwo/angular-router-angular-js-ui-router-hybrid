import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

import { AppComponent } from './app.component';
import { LegacyAppUpgradeDirective } from './legacy/upgrade/legacy.app.component.upgrade';
import './legacy/'; // imported so legacy files are bundled
import { legacyApp } from './legacy/legacy.app.module';
import { HelloNgComponent } from './hello-ng/hello-ng.component';
import { AppRoutingModule } from './routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    // Import the upgraded legacyApp so Angular knows about it
    // and we can use it in our app component
    LegacyAppUpgradeDirective,
    HelloNgComponent
  ],
  imports: [
    BrowserModule,
    // Add this so Angular can use the Upgrade module
    UpgradeModule,
    AppRoutingModule,
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
