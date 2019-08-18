import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * User configuration service.
 */
@Injectable()
export class UserConfigService {

  /**
   * Constructor.
   * @param http Http client
   * @param handlers Http handlers
   * @param window window reference
   */
  constructor(
    private http: HttpClient,
    private handlers: CustomHttpHandlersService,
    @Inject('Window') private window: Window
  ) {}

  /**
   * User config json.
   */
  private url: string = this.window.location.origin + '/assets/config.json';

  /**
   * Gets user config over http.
   */
  public getData(): Observable<any> {
    return this.http.get(this.url).pipe(
      timeout(10000),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
  }

}
