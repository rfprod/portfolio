import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { IMailerResponse } from 'src/app/interfaces';
import { WINDOW } from '../app-services.module';
import {
  CustomHttpHandlersService,
  EHttpProgressModifier,
} from '../http-handlers/custom-http-handlers.service';

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
    private readonly handlers: CustomHttpHandlersService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  /**
   * Sends email.
   * @param formData form data
   */
  public sendEmail(formData: any): Observable<IMailerResponse> {
    this.handlers.toggleHttpProgress(EHttpProgressModifier.START);
    return this.http.post(this.url, formData).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IMailerResponse) => res),
      finalize(() => {
        this.handlers.toggleHttpProgress(EHttpProgressModifier.STOP);
      }),
    );
  }
}
