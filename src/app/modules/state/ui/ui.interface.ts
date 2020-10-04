import { StateToken } from '@ngxs/store';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IUiState {
  sidenavOpened: boolean;
}

export const UI_STATE_TOKEN = new StateToken<IUiState>('ui');

export const uiStateInitialValue: IUiState = {
  sidenavOpened: false,
};

export type TUiPayload = IActionPayload<Partial<IUiState>>;
