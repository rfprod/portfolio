import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WINDOW } from '../app-services.module';
import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

/**
 * User configuration service.
 */
@Injectable({
  providedIn: 'root',
})
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
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Gets user config over http.
   */
  public getData(): Observable<any> {
    return this.http.get(this.url).pipe(
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }
}
