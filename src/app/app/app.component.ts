import { Component, OnInit, OnDestroy } from '@angular/core';

import { DateAdapter } from '@angular/material';

import { EventEmitterService } from '../services/emitter/event-emitter.service';
import { UtilsService } from '../services/utils/utils.service';

/**
 * Application root component.
 */
@Component({
  selector: 'root',
  template: `
    <span id="spinner" *ngIf="showSpinner">
      <mat-progress-bar mode="indeterminate" aria-label="Application progress bar"></mat-progress-bar>
    </span>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * @param dateAdapter Date adapter
   * @param emitter Event emitter
   * @param utils Utilities service
   */
  constructor(
    private dateAdapter: DateAdapter<any>,
    private emitter: EventEmitterService,
    private utils: UtilsService
  ) {}

  /**
   * Component subscriptions.
   */
  private subscriptions: any[] = [];

  /**
   * Indicates if spinner should be shown ow not.
   */
  public showSpinner: boolean = false;

  /**
   * Shows progress spinner.
   */
  private startSpinner(): void {
    this.showSpinner = true;
  }
  /**
   * Hides progress spinner.
   */
  private stopSpinner(): void {
    this.showSpinner = false;
  }

  /**
   * Sets datepicker locale.
   */
  private setDatepickerLocale(): void {
    this.dateAdapter.setLocale('en');
  }

  /**
   * Subscription methods.
   */
  private subscribe: { datepickerLocaleChanges: () => void, eventEmitter: () => void } = {
    datepickerLocaleChanges: () => {
      const sub = this.dateAdapter.localeChanges.subscribe(() => {
        console.log('dateAdapter.localeChanges, changed according to the language');
      });
      this.subscriptions.push(sub);
    },
    eventEmitter: () => {
      const sub = this.emitter.getEmitter().subscribe((event: any) => {
        console.log('app consuming event:', event);
        if (event.spinner) {
          if (event.spinner === 'start') {
            console.log('starting spinner');
            this.startSpinner();
          } else if (event.spinner === 'stop') {
            console.log('stopping spinner');
            this.stopSpinner();
          }
        }
      });
      this.subscriptions.push(sub);
    }
  };

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppComponent initialized');

    this.setDatepickerLocale();

    this.subscribe.eventEmitter();

    this.subscribe.datepickerLocaleChanges();

  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppComponent destroyed');
    this.utils.unsubscribeFromAll(this.subscriptions);
  }

}
