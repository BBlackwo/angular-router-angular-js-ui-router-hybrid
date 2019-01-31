import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelloNgComponent } from './../hello-ng/hello-ng.component';
import { routeHelper } from './route-helper';

@Component({selector: 'app-empty', template: ''})
export class EmptyComponent {}

const routes: Routes = [
  { path: 'hello-ng', component: HelloNgComponent },

  // Has to be last once all the other routes haven't matched
  { path: '**', component: EmptyComponent },
];

@NgModule({
  declarations: [EmptyComponent],
  imports: [RouterModule.forRoot(routes,
    { enableTracing: false } // <-- For debugging purposes only. Should be turned off in prod.
  )],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {
    routeHelper.init(routes);
  }
}
