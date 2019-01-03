import { legacyApp } from './legacy.app.module';

export const LEGACY_APP_COMP_SELECTOR = 'legacyAppComp';

legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `<ui-view></ui-view>`,
});
