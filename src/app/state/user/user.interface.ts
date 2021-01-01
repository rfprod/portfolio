import { Observable } from 'rxjs';

import {
  IGithubRepoLanguages,
  IGithubRepoLanguagesRate,
  IGithubUserOrganization,
  IGithubUserPublicEvent,
  IGithubUserRepo,
  IGuthubUser,
} from '../../interfaces/github-api.interface';
import { IUserConfig, IUserConfigProfile } from '../../interfaces/user-config.interface';
import { IActionPayload } from '../../utils/ngxs.util';

export interface IUserState {
  profiles: IUserConfigProfile[];
  userConfig?: IUserConfig;
  github?: IGuthubUser;
  githubRepos: IGithubUserRepo[];
  githubLanguages?: IGithubRepoLanguages;
  githubLanguagesTotal: number;
  githubLanguagesRate?: IGithubRepoLanguagesRate;
  githubLanguagesKeys: string[];
  imgShow: {
    github: boolean;
    codepen: boolean;
    codewars: boolean;
    hackerrank: boolean;
    languageIcons: {
      [key: string]: boolean;
    };
  };
  githubOrgs: IGithubUserOrganization[];
  publicEvents: IGithubUserPublicEvent<unknown>[];
}

export type TUserPayload = IActionPayload<Partial<IUserState>>;

export interface IUserService {
  getUserData(): void;
  readonly githubOrgs$: Observable<IGithubUserOrganization[]>;
  readonly publicEvents$: Observable<IGithubUserPublicEvent<unknown>[]>;
}
