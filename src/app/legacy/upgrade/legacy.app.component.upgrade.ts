import { Directive, ElementRef, Injector } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import { LEGACY_APP_COMP_SELECTOR } from '../legacy.app.component';

// We upgrade it so we can use it in our Angular app
@Directive({
  selector: 'legacy-app-upgrade' // tslint:disable-line
})
export class LegacyAppUpgradeDirective extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {
    super(LEGACY_APP_COMP_SELECTOR, elementRef, injector);
  }
}
