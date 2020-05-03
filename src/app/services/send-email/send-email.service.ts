import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { IMailerResponse } from 'src/app/interfaces';

import {
  EHTTP_PROGRESS_MODIFIER,
  HttpHandlersService,
} from '../http-handlers/http-handlers.service';
import { WINDOW } from '../providers.config';

/**
 * Send email service.
 */
@Injectable({
  providedIn: 'root',
})
export class SendEmailService {
  /**
   * Endpoint.
   */
  private readonly url: string = `${this.win.location.origin}/api/sendEmail`;

  constructor(
    private readonly http: HttpClient,
    private readonly handlers: HttpHandlersService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  /**
   * Sends email.
   * @param formData form data
   * TODO: formData interface
   */
  public sendEmail(formData: unknown): Observable<IMailerResponse> {
    this.handlers.toggleHttpProgress(EHTTP_PROGRESS_MODIFIER.START);
    return this.http.post(this.url, formData).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IMailerResponse) => res),
      finalize(() => {
        this.handlers.toggleHttpProgress(EHTTP_PROGRESS_MODIFIER.STOP);
      }),
    );
  }
}
