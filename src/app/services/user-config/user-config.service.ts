import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { IUserConfig } from 'src/app/interfaces';

import {
  EHTTP_PROGRESS_MODIFIER,
  HttpHandlersService,
} from '../http-handlers/http-handlers.service';
import { WINDOW } from '../providers.config';

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
  private readonly url: string = `${this.win.location.origin}/assets/config.json`;

  constructor(
    private readonly http: HttpClient,
    private readonly handlers: HttpHandlersService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  /**
   * Gets user config over http.
   */
  public getUserConfig(): Observable<IUserConfig> {
    this.handlers.toggleHttpProgress(EHTTP_PROGRESS_MODIFIER.START);
    return this.http.get(this.url).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IUserConfig) => res),
      finalize(() => {
        this.handlers.toggleHttpProgress(EHTTP_PROGRESS_MODIFIER.STOP);
      }),
    );
  }
}
