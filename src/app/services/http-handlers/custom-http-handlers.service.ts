import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Http progress interface.
 * Counter stands for number of http request in progress.
 * Loading indicates loading state.
 */
export interface IHttpProgress {
  counter: number;
  loading: boolean;
}

export enum EHttpProgressModifier {
  START = -1,
  STOP = 1,
}

/**
 * Custom http handlers.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomHttpHandlersService {
  /**
   * Http progress state.
   */
  public readonly httpProgress$ = new BehaviorSubject<IHttpProgress>({
    counter: 0,
    loading: false,
  });

  /**
   * Toggles http progress state.
   * @param progress http progress modifier.
   */
  public toggleHttpProgress(progress: EHttpProgressModifier): void {
    const newProgress = this.httpProgress$.value;
    newProgress.counter = newProgress.counter + progress;
    newProgress.loading = newProgress.counter === 0 ? false : true;
    this.httpProgress$.next(newProgress);
  }

  /**
   * Handles http error response.
   * @param error http error response.
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
