import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { filter, map } from 'rxjs/operators';

import { HttpHandlersService } from '../../services/http-handlers/http-handlers.service';

/**
 * Application root component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public readonly showSpinner$ = this.handlers.httpProgress$.pipe(
    filter(progress => typeof progress.loading === 'boolean'),
    map(progress => progress.loading),
  );

  /**
   * Constructor.
   */
  constructor(
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly handlers: HttpHandlersService,
  ) {}

  /**
   * Lifecycle hook.
   */
  public ngOnInit(): void {
    this.setDatepickerLocale();
  }

  /**
   * Sets datepicker locale.
   */
  private setDatepickerLocale(): void {
    this.dateAdapter.setLocale('en');
  }
}
