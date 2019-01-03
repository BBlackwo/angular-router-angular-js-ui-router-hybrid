import { legacyApp } from './legacy.app.module';
import { LegacyAppController } from './legacy.app.controller';

export const LEGACY_APP_COMP_SELECTOR = 'legacyAppComp';

legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `<ui-view ng-if="$ctrl.ajsShouldHandleRoute()"></ui-view>`,
  controller: LegacyAppController,
});
