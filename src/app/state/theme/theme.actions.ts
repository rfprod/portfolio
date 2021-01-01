import { getActionCreator } from 'src/app/utils/ngxs.util';

import { TThemePayload } from './theme.interface';

const createAction = getActionCreator('Theme');

export const setThemeState = createAction<TThemePayload>('set state');
