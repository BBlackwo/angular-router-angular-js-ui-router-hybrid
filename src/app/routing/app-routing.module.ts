import { HelloNgComponent } from './../hello-ng/hello-ng.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'hello-ng',
    component: HelloNgComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { enableTracing: true } // <-- For debugging purposes only. Should be turned off in prod.
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
