import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AppContactComponent } from './components/contact/app-contact.component';
import { AppIndexComponent } from './components/index/app-index.component';
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { AutoscrollDirective } from './directives/autoscroll/autoscroll.directive';
import { CustomMaterialModule } from './modules/material/custom-material.module';
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
    CustomMaterialModule.forRoot(),
    AppServicesModule.forRoot(),
    AppRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
