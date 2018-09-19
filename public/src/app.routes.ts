import { Routes } from '@angular/router';
import { AppIndexComponent } from './components/app-index.component';

export const APP_ROUTES: Routes = [
	{ path: 'index', component: AppIndexComponent },
	{ path: '', redirectTo: 'index', pathMatch: 'full' },
	{ path: '**', redirectTo: 'index' }
];
