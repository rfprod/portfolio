import { Injectable } from '@angular/core';

/**
 * Custom http handlers.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomHttpHandlersService {
  /**
   * Extracts object from response.
   * @param res http response
   */
  public extractObject(res: object): object {
    return res || {};
  }

  /**
   * Extracts object from response.
   * @param res http response
   */
  public extractArray(res: any[]): any[] {
    return res || [];
  }

  /**
   * Handles request error.
   * @param error error object
   */
  public handleError(error: any): any {
    const errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return errMsg;
  }
}
