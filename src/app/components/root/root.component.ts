import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { HttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { AppThemeService } from '../../state/theme/theme.service';
import { AppThemeState } from '../../state/theme/theme.store';
import { uiActions, UiState } from '../../state/ui/ui.store';

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
   * Defines if UI should use alternative dark material theme.
   */
  @HostBinding('class.unicorn-dark-theme') public darkTheme = false;

  /**
   * Asyncronous material theme state.
   */
  public readonly getTheme$ = this.store.select(AppThemeState.getTheme).pipe(
    tap(theme => {
      this.darkTheme = theme.darkThemeEnabled;
    }),
  );

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
    private readonly themeService: AppThemeService,
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
   * Sets application theme depending on time.
   */
  public setTheme(): void {
    const hours = new Date().getHours();
    const morning = 9;
    const evening = 18;
    if (hours <= morning || hours >= evening) {
      void this.themeService.enableDarkTheme().subscribe();
    } else {
      void this.themeService.disableDarkTheme().subscribe();
    }
  }

  /**
   * Lifecycle hook.
   */
  public ngOnInit(): void {
    this.setDatepickerLocale();
    /**
     * @note TODO: set theme
     */
    // this.setTheme();
  }

  /**
   * Sets datepicker locale.
   */
  private setDatepickerLocale(): void {
    this.dateAdapter.setLocale('en');
  }
}
