import {
  NgModule,
  ModuleWithProviders,
  Provider
} from "@angular/core";

import {
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';

import { CustomDeferredService } from './deferred/custom-deferred.service';
import { CustomHttpHandlersService } from './http-handlers/custom-http-handlers.service';
import { EventEmitterService } from './emitter/event-emitter.service';
import { UserConfigService } from './user-config/user-config.service';
import { SendEmailService } from './send-email/send-email.service';
import { GithubService } from './github/github.service';

/**
 * Window factory.
 */
export function windowFactory(): Window {
  return window;
}

/**
 * Application services module providers.
 */
export const appServicesModuleProviders: Provider[] = [
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },
  {
    provide: 'Window',
    useFactory: windowFactory
  },
  CustomDeferredService,
  CustomHttpHandlersService,
  EventEmitterService,
  UserConfigService,
  SendEmailService,
  GithubService
];

/**
 * Application services module.
 */
@NgModule({
  providers: [
    ...appServicesModuleProviders
  ]
})
export class AppServicesModule {

  /**
   * Provides services.
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppServicesModule,
      providers: [
        ...appServicesModuleProviders
      ]
    };
  }

}
