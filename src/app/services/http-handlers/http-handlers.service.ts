import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, throwError } from 'rxjs';

/**
 * Http progress interface.
 * Counter stands for number of http request in progress.
 * Loading indicates loading state.
 */
export interface IHttpProgress {
  counter: number;
  loading: boolean;
}

export enum HTTP_PROGRESS_MODIFIER {
  START = -1,
  STOP = 1,
}

/**
 * Custom http handlers.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpHandlersService {
  /**
   * Http progress state.
   */
  private readonly httpProgress = new BehaviorSubject<IHttpProgress>({
    counter: 0,
    loading: false,
  });

  public readonly httpProgress$ = this.httpProgress.asObservable();

  /**
   * Constructor.
   * @param snackBar Error toaster
   */
  constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Toggles http progress state.
   * @param progress http progress modifier.
   */
  public toggleHttpProgress(progress: HTTP_PROGRESS_MODIFIER): void {
    const newProgress = this.httpProgress.value;
    newProgress.counter = newProgress.counter + progress;
    newProgress.loading = newProgress.counter === 0 ? false : true;
    this.httpProgress.next(newProgress);
  }

  /**
   * Gets error message from error http response.
   */
  public getErrorMessage(error: HttpErrorResponse): string {
    const msg: string = Boolean(error.message) ? error.message : error.error;
    const errorMessage: string = Boolean(msg)
      ? msg
      : Boolean(error.status)
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return errorMessage;
  }

  /**
   * Handles http error response.
   * @param error http error response.
   */
  public handleError(error: HttpErrorResponse) {
    const errorMessage = this.getErrorMessage(error);
    this.displayErrorToast(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Displays error toast.
   */
  private displayErrorToast(error: string): void {
    const duration = 2000;
    this.snackBar.open(error, void 0, {
      duration,
    });
  }
}
