import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { setUserState } from './user.actions';
import { IUserState, TUserPayload } from './user.interface';

export const userActions = {
  setUserState,
};

export const USER_STATE_TOKEN = new StateToken<IUserState>('user');

@State<IUserState>({
  name: USER_STATE_TOKEN,
  defaults: {
    profiles: [],
    userConfig: void 0,
    github: void 0,
    githubRepos: [],
    githubLanguages: void 0,
    githubLanguagesTotal: 0,
    githubLanguagesRate: void 0,
    githubLanguagesKeys: [],
    imgShow: {
      github: true,
      codepen: true,
      codewars: true,
      hackerrank: true,
      languageIcons: {},
    },
    githubOrgs: [],
    publicEvents: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserState {
  /**
   * State selector.
   * @param state
   */
  @Selector([USER_STATE_TOKEN])
  public static getState(state: IUserState) {
    return state;
  }

  /**
   * Set state action.
   * @param ctx
   * @param param1
   */
  @Action(setUserState)
  public setUserState(ctx: StateContext<IUserState>, { payload }: TUserPayload) {
    return ctx.patchState(payload);
  }
}
