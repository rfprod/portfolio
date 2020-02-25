import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { DateAdapter } from '@angular/material/core';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

/**
 * Application root component.
 */
@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * Indicates if spinner should be shown ow not.
   */
  public showSpinner = true;

  /**
   * Subscription methods.
   */
  private readonly subscribe: { datepickerLocaleChanges(): void; eventEmitter(): void; } = {
    datepickerLocaleChanges: () => {
      this.dateAdapter.localeChanges.pipe(untilDestroyed(this)).subscribe(() => {
        console.log('dateAdapter.localeChanges, changed according to the language');
      });
    },
    eventEmitter: () => {
      this.emitter.getEmitter().pipe(untilDestroyed(this)).subscribe((event: any) => {
        if (event.spinner) {
          if (event.spinner === 'start') {
            this.startSpinner();
          } else if (event.spinner === 'stop') {
            this.stopSpinner();
          }
        }
      });
    },
  };

  /**
   * Constructor.
   * @param dateAdapter Date adapter
   * @param emitter Event emitter
   */
  constructor(
    private readonly dateAdapter: DateAdapter<any>,
    private readonly emitter: EventEmitterService,
  ) {}

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    this.setDatepickerLocale();
    this.subscribe.eventEmitter();
    this.subscribe.datepickerLocaleChanges();
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {}

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

}
