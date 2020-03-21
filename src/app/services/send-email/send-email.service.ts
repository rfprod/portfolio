import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WINDOW } from '../app-services.module';
import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

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
  private readonly url: string = `${this.window.location.origin}/api/sendEmail`;

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
   * Sends email.
   * @param formData form data
   */
  public sendEmail(formData: any): Observable<any> {
    return this.http.post(this.url, formData).pipe(
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }
}
