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

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppActivityComponent } from './components/activity/activity.component';
import { AppApplicationsComponent } from './components/applications/applications.component';
import { AppContactComponent } from './components/contact/contact.component';
import { AppIndexComponent } from './components/index/index.component';
import { AppLanguagesComponent } from './components/languages/languages.component';
import { AppOrganizationsComponent } from './components/organizations/organizations.component';
import { AppProfilesComponent } from './components/profiles/profiles.component';
import { AppRootComponent } from './components/root/root.component';
import { AppStatusBadgesComponent } from './components/status-badges/status-badges.component';
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { AutoscrollDirective } from './directives/autoscroll/autoscroll.directive';
import { AppMaterialModule } from './modules/material/material.module';
import { AppServicesModule } from './services/app-services.module';
import { AppThemeStoreModule } from './state/theme/theme.module';
import { UiStoreModule } from './state/ui/ui.module';
import { UserStoreModule } from './state/user/user.module';

/**
 * Root application module.
 */
@NgModule({
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
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production, collapsed: true }),
    AppThemeStoreModule,
    UserStoreModule,
    UiStoreModule,
    AppMaterialModule.forRoot(),
    AppServicesModule.forRoot(),
    AppRoutingModule,
  ],
  declarations: [
    AppRootComponent,
    AppIndexComponent,
    AppStatusBadgesComponent,
    AppProfilesComponent,
    AppOrganizationsComponent,
    AppLanguagesComponent,
    AppContactComponent,
    AutofocusDirective,
    AutoscrollDirective,
    AppApplicationsComponent,
    AppActivityComponent,
  ],
  entryComponents: [AppProfilesComponent, AppLanguagesComponent, AppContactComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppRootComponent],
})
export class AppModule {}
