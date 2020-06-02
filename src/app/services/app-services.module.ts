import { ModuleWithProviders, NgModule } from '@angular/core';

import { appServicesModuleProviders } from './providers.config';

/**
 * Application services module.
 */
@NgModule({
  providers: [...appServicesModuleProviders],
})
export class AppServicesModule {
  /**
   * Provides services.
   */
  public static forRoot(): ModuleWithProviders<AppServicesModule> {
    return {
      ngModule: AppServicesModule,
      providers: [...appServicesModuleProviders],
    };
  }
}
