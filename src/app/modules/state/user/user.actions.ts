import { getActionCreator } from '../../../utils/ngxs.util';
import { TUserPayload } from './user.interface';

const createAction = getActionCreator('User');

export const setUserState = createAction<TUserPayload>('User: set state');
