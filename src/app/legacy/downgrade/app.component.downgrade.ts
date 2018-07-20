import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';

import { legacyApp } from '../legacy.app.module';
import { AppComponent } from '../../app.component';

// IMPORTANT: This is necessary because:
// "AngularJS is always bootstrapped first and owns the root component."
// See: https://angular.io/api/upgrade/static/UpgradeModule
legacyApp.directive('appRoot',
  downgradeComponent({
    component: AppComponent,
    outputs: ['callback']
  }) as angular.IDirectiveFactory
);
