import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './modules/custom-material.module';

import { AppComponent } from './app.component';
import { AppIndexComponent } from './components/app-index.component';
import { AppContactComponent } from './components/app-contact.component';

import { AutofocusDirective } from './directives/autofocus.directive';

import { EventEmitterService } from './services/event-emitter.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';

import { UserConfigService } from './services/user-config.service';
import { SendEmailService } from './services/send-email.service';
import { GithubService } from './services/github.service';

@NgModule({
	declarations: [ AppComponent, AppIndexComponent, AppContactComponent, AutofocusDirective ],
	entryComponents: [ AppContactComponent ],
	imports 		: [ BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule, FormsModule,
									ReactiveFormsModule, HttpClientModule, RouterModule.forRoot(APP_ROUTES) ],
	providers 	: [ { provide: APP_BASE_HREF, useValue: '/' }, { provide: LocationStrategy, useClass: PathLocationStrategy },
									{ provide: 'Window', useValue: window }, CustomDeferredService, CustomHttpHandlersService,
									EventEmitterService, UserConfigService, SendEmailService, GithubService ],
	schemas 		: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap 	: [ AppComponent ],
})
export class AppModule {}
