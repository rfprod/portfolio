import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AppContactComponent } from './components/contact/app-contact.component';
import { AppIndexComponent } from './components/index/app-index.component';
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { AutoscrollDirective } from './directives/autoscroll/autoscroll.directive';
import { CustomMaterialModule } from './modules/material/custom-material.module';
import { UserStoreModule } from './modules/state/user/user.module';
import { AppServicesModule } from './services/app-services.module';

/**
 * Root application module.
 */
@NgModule({
  declarations: [
    AppComponent,
    AppIndexComponent,
    AppContactComponent,
    AutofocusDirective,
    AutoscrollDirective,
  ],
  entryComponents: [AppContactComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    environment.production ? null : NgxsLoggerPluginModule.forRoot(),
    UserStoreModule,
    CustomMaterialModule.forRoot(),
    AppServicesModule.forRoot(),
    AppRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
