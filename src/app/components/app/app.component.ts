import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';

/**
 * Application root component.
 */
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Indicates if spinner should be displayed.
   */
  public readonly showSpinner$ = new BehaviorSubject<boolean>(true);

  /**
   * Subscription methods.
   */
  private readonly subscribe: { datepickerLocaleChanges(): void; eventEmitter(): void } = {
    datepickerLocaleChanges: () => {
      this.dateAdapter.localeChanges
        .pipe(
          untilDestroyed(this),
          tap(changes => {
            console.warn('dateAdapter.localeChanges', changes);
          }),
        )
        .subscribe();
    },
    eventEmitter: () => {
      this.emitter
        .getEmitter()
        .pipe(
          untilDestroyed(this),
          tap((event: any) => {
            if (event.spinner) {
              if (event.spinner === 'start') {
                this.startSpinner();
              } else if (event.spinner === 'stop') {
                this.stopSpinner();
              }
            }
          }),
        )
        .subscribe();
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
   * Activates subscriptions.
   */
  public ngOnInit(): void {
    this.setDatepickerLocale();
    this.subscribe.eventEmitter();
    this.subscribe.datepickerLocaleChanges();
  }

  public ngOnDestroy(): void {}

  private startSpinner(): void {
    this.showSpinner$.next(true);
  }

  private stopSpinner(): void {
    this.showSpinner$.next(false);
  }

  private setDatepickerLocale(): void {
    this.dateAdapter.setLocale('en');
  }
}
