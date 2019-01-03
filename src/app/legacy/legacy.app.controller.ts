import { LegacyRouteHelper } from './routing/legacy.route-helper';

export class LegacyAppController {
  static $inject = ['legacyRouteHelper'];
  constructor(private legacyRouteHelper: LegacyRouteHelper) {}

  ajsShouldHandleRoute(): Boolean {
    return this.legacyRouteHelper.ajsShouldHandleRoute();
  }
}
