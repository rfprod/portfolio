import { Injectable } from '@angular/core';

/**
 * Custom deferred service.
 */
@Injectable()
export class CustomDeferredService<T> {

  /**
   * Constructor.
   */
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * Promise.
   */
  public promise: Promise<T>;
  /**
   * Resolve function.
   */
  public resolve: (value?: T | PromiseLike<T>) => void;
  /**
   * Reject function.
   */
  public reject: (reason?: any) => void;

}
