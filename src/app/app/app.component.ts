import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { DateAdapter } from '@angular/material';

import { EventEmitterService } from '../services/emitter/event-emitter.service';

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
   * @param el Element reference
   * @param dateAdapter Date adapter
   * @param emitter Event emitter
   */
  constructor(
    private el: ElementRef,
    private dateAdapter: DateAdapter<any>,
    private emitter: EventEmitterService
  ) {
    console.log('this.el.nativeElement', this.el.nativeElement);
  }

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
    console.log('spinner start');
    this.showSpinner = true;
  }
  /**
   * Hides progress spinner.
   */
  private stopSpinner(): void {
    console.log('spinner stop');
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
    if (this.subscriptions.length) {
      for (const sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
  }

}
