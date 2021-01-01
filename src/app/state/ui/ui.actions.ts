import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TUiPayload } from './ui.interface';

const createAction = getActionCreator('UI');

export const setUiState = createAction<TUiPayload>('set state');
