import { Injectable } from '@angular/core';

/**
 * Mocked snackbar ref.
 */
@Injectable()
export class MatSnackbarRefMock {
  public open(message: string, action: string, options: Record<string, unknown>): boolean {
    return true;
  }

  public dismiss(): boolean {
    return true;
  }
}
