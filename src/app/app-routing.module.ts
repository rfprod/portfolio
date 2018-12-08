import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppIndexComponent } from './components/index/app-index.component';

/**
 * Application routes config.
 */
const routes: Routes = [
  { path: 'index', component: AppIndexComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'index' }
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
