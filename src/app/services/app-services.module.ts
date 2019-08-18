import {
  NgModule,
  ModuleWithProviders
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
 * Application services module.
 */
@NgModule({
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: 'Window',
      useValue: window
    },
    CustomDeferredService,
    CustomHttpHandlersService,
    EventEmitterService,
    UserConfigService,
    SendEmailService,
    GithubService
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
        {
          provide: LocationStrategy,
          useClass: PathLocationStrategy
        },
        {
          provide: 'Window',
          useValue: window
        },
        CustomDeferredService,
        CustomHttpHandlersService,
        EventEmitterService,
        UserConfigService,
        SendEmailService,
        GithubService
      ]
    };
  }

}
