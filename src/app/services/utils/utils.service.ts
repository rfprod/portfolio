import { Injectable } from '@angular/core';

/**
 * Utilities service.
 */
@Injectable()
export class UtilsService {

  /**
   * Unsubscribes from all subscriptions.
   * @param subscriptions array of subscriptions
   */
  public unsubscribeFromAll(subscriptions: any[]): any[] {
    if (subscriptions.length) {
      for (const sub of subscriptions) {
        sub.unsubscribe();
      }
    }
    return subscriptions;
  }

}
