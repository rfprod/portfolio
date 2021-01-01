import { Observable } from 'rxjs';
import { IActionPayload } from 'src/app/utils/ngxs.util';

export interface IThemeStateModel {
  darkThemeEnabled: boolean;
}

export type TThemePayload = IActionPayload<IThemeStateModel>;

export interface IAppThemeService {
  darkThemeEnabled$: Observable<boolean>;
}
