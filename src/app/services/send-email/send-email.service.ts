import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * Send email service.
 */
@Injectable()
export class SendEmailService {

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
   * Endpoint.
   */
  private url: string = this.window.location.origin + '/api/sendEmail';

  /**
   * Sends email.
   * @param formData form data
   */
  public sendEmail(formData: any): Observable<any> {
    return this.http.post(this.url, formData).pipe(
      timeout(10000),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
  }

}
