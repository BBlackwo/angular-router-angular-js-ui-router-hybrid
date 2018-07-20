import { legacyApp } from './legacy.app.module';

export const LEGACY_APP_COMP_SELECTOR = 'legacyAppComp';

legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `<h2>Legacy App</h2>`,
  controller: () => console.log('Hello from Legacy App Controller'),
});