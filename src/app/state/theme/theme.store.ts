import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { setThemeState } from './theme.actions';
import { IThemeStateModel, TThemePayload } from './theme.interface';

@State<IThemeStateModel>({
  name: 'theme',
  defaults: {
    darkThemeEnabled: false,
  },
})
@Injectable({
  providedIn: 'root',
})
export class AppThemeState {
  /**
   * UI state getter.
   */
  @Selector()
  public static getTheme(state: IThemeStateModel) {
    return state;
  }

  /**
   * Dark theme enabled state getter.
   */
  @Selector()
  public static getDarkThemeEnabled(state: IThemeStateModel) {
    return state.darkThemeEnabled;
  }

  /**
   * Sets UI state.
   */
  @Action(setThemeState)
  public setThemeState(ctx: StateContext<IThemeStateModel>, { payload }: TThemePayload) {
    return ctx.patchState(payload);
  }
}

export const themeThemeActions = {
  setThemeState,
};
