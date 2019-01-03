import { Router } from '@angular/router';

import { legacyApp } from '../legacy.app.module';

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
