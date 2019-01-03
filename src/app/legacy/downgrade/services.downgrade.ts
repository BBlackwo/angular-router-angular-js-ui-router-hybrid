import { downgradeInjectable } from '@angular/upgrade/static';
import { Router } from '@angular/router';

import { legacyApp } from '../legacy.app.module';

legacyApp.factory('router', downgradeInjectable(Router));
