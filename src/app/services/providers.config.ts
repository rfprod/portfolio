import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { InjectionToken, Provider } from '@angular/core';

/**
 * Window factory.
 */
export function windowFactory(): Window {
  return window;
}

/**
 * Window injection token.
 */
export const WINDOW = new InjectionToken<string>('Window');

/**
 * Application services module providers.
 */
export const appServicesModuleProviders: Provider[] = [
  {
    provide: APP_BASE_HREF,
    useValue: '/',
  },
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy,
  },
  {
    provide: WINDOW,
    useFactory: windowFactory,
  },
];
