import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';

import {
  APP_BASE_HREF,
} from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';

import { CustomMaterialModule } from './modules/material/custom-material.module';

import { AppRoutingModule } from './app-routing.module';

import { AppServicesModule } from './services/app-services.module';

import { AppComponent } from './components/app/app.component';
import { AppContactComponent } from './components/contact/app-contact.component';
import { AppIndexComponent } from './components/index/app-index.component';

import { AutofocusDirective } from './directives/autofocus/autofocus.directive';

/**
 * Root application module.
 */
@NgModule({
  declarations: [
    AppComponent,
    AppIndexComponent,
    AppContactComponent,
    AutofocusDirective,
  ],
  entryComponents: [
    AppContactComponent,
  ],
  imports : [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    CustomMaterialModule.forRoot(),
    AppServicesModule.forRoot(),
    AppRoutingModule,
  ],
  providers : [
    {
      provide: APP_BASE_HREF,
      useValue: '/',
    },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
