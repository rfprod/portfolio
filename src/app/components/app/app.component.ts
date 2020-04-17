import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, tap } from 'rxjs/operators';
import { CustomHttpHandlersService } from '../../services/http-handlers/custom-http-handlers.service';

/**
 * Application root component.
 */
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly showSpinner$ = this.handlers.httpProgress$.pipe(
    filter(progress => typeof progress.loading === 'boolean'),
    map(progress => progress.loading),
  );

  /**
   * Subscription methods.
   */
  private readonly datepickerLocaleChanges = this.dateAdapter.localeChanges.pipe(
    untilDestroyed(this),
    tap(changes => {
      console.warn('dateAdapter.localeChanges', changes);
    }),
  );

  constructor(
    private readonly dateAdapter: DateAdapter<any>,
    private readonly handlers: CustomHttpHandlersService,
  ) {}

  /**
   * Activates subscriptions.
   */
  public ngOnInit(): void {
    this.setDatepickerLocale();
    this.datepickerLocaleChanges.subscribe();
  }

  public ngOnDestroy(): void {}

  private setDatepickerLocale(): void {
    this.dateAdapter.setLocale('en');
  }
}
