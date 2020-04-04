import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Custom http handlers.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomHttpHandlersService {
  /**
   * Handles http error response.
   */
  public handleError(error: HttpErrorResponse): string {
    const errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return errMsg;
  }
}
