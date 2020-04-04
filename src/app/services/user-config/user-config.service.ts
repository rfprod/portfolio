import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUserConfig } from 'src/app/interfaces';
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
  private readonly url: string = `${this.win.location.origin}/assets/config.json`;

  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  /**
   * Gets user config over http.
   */
  public getUserConfig(): Observable<IUserConfig> {
    return this.http.get(this.url).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IUserConfig) => res),
    );
  }
}
