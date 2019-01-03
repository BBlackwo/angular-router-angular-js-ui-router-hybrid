import { Router } from '@angular/router';

import { legacyApp } from '../legacy.app.module';
import { routeHelper } from '../../../../src/app/routing/route-helper';

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

  ajsShouldHandleRoute(): Boolean {
    return !routeHelper.isValidRoute(this.$location.path());
  }
}

legacyApp.service('legacyRouteHelper', LegacyRouteHelper);
