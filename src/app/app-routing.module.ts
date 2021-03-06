import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppIndexComponent } from './components/index/index.component';

/**
 * Application routes config.
 */
const ROUTES: Route[] = [
  {
    path: '',
    component: AppIndexComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
