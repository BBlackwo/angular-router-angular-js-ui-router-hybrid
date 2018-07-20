import { legacyApp } from './legacy.app.module';

export const LEGACY_APP_COMP_SELECTOR = 'legacyAppComp';

legacyApp.component(LEGACY_APP_COMP_SELECTOR, {
  template: `
    <div class="comp ajs">
      <h2>Legacy App Component</h2>
    <div>
  `,
  controller: () => console.log('Hello from Legacy App Controller'),
});
