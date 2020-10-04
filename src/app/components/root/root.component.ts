import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { uiActions, UiState } from '../../modules/state/ui/ui.store';
import { HttpHandlersService } from '../../services/http-handlers/http-handlers.service';

/**
 * Application root component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRootComponent implements OnInit {
  /**
   * Sidenav opened state.
   */
  @Select(UiState.getSidenavOpened)
  public readonly sidenavOpened$!: Observable<boolean>;

  public readonly showSpinner$ = this.handlers.httpProgress$.pipe(
    filter(progress => typeof progress.loading === 'boolean'),
    map(progress => progress.loading),
  );

  /**
   * Constructor.
   */
  constructor(
    private readonly store: Store,
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly handlers: HttpHandlersService,
  ) {}

  /**
   * Closes sidebar.
   */
  public sidebarCloseHandler(): void {
    void this.store.dispatch(new uiActions.patchState({ sidenavOpened: false }));
  }

  /**
   * Toggles sidenav state.
   */
  public toggleSidenav(): void {
    void this.store.dispatch(new uiActions.toggleSidenav());
  }

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
