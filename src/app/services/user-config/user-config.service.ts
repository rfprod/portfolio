import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

/**
 * User configuration service.
 */
@Injectable()
export class UserConfigService {

  /**
   * User config json.
   */
  private readonly url: string = `${this.window.location.origin}/assets/config.json`;

  /**
   * Constructor.
   * @param http Http client
   * @param handlers Http handlers
   * @param window window reference
   */
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Gets user config over http.
   */
  public getData(): Observable<any> {
    return this.http.get(this.url).pipe(
      take(1),
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }

}
