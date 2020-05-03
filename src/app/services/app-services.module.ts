import { ModuleWithProviders, NgModule } from '@angular/core';

import { appServicesModuleProviders } from './providers.config';

/**
 * Application services module.
 */
@NgModule({
  providers: [...appServicesModuleProviders],
})
export class AppServicesModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppServicesModule,
      providers: [...appServicesModuleProviders],
    };
  }
}
