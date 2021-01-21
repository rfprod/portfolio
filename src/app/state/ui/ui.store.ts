import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { getActionCreator } from 'src/app/utils/ngxs.util';

import { IUiState, TUiPayload, UI_STATE_TOKEN, uiStateInitialValue } from './ui.interface';

const createAction = getActionCreator('UI');

const patchState = createAction<TUiPayload>('patch state');
const toggleSidenav = createAction('toggle sidenav');

export const uiActions = {
  patchState,
  toggleSidenav,
};

@State<IUiState>({
  name: UI_STATE_TOKEN,
  defaults: uiStateInitialValue,
})
@Injectable()
export class UiState {
  /**
   * UI state selector.
   * @param state
   */
  @Selector()
  public static getState(state: IUiState) {
    return state;
  }

  /**
   * Sidenav opened state selector.
   * @param state
   */
  @Selector()
  public static getSidenavOpened(state: IUiState) {
    return state.sidenavOpened;
  }

  /**
   * Set UI state action.
   * @param ctx
   * @param param1
   */
  @Action(patchState)
  public patchState(ctx: StateContext<IUiState>, { payload }: TUiPayload) {
    return ctx.patchState(payload);
  }

  /**
   * Toggles sidebav state.
   * @param ctx
   * @param param1
   */
  @Action(toggleSidenav)
  public toggleSidenav(ctx: StateContext<IUiState>) {
    const payload = { sidenavOpened: !ctx.getState().sidenavOpened };
    return ctx.patchState(payload);
  }
}
