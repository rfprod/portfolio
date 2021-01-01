import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { concatMap, filter, map, mapTo, tap } from 'rxjs/operators';

import {
  IGithubRepoLanguages,
  IGithubUserOrganization,
  IGithubUserPublicEvent,
  IGithubUserRepo,
  IGuthubUser,
} from '../../interfaces/github-api.interface';
import { IUserConfig } from '../../interfaces/user-config.interface';
import { GithubService } from '../../services/github/github.service';
import { UserConfigService } from '../../services/user-config/user-config.service';
import { IUserService } from './user.interface';
import { USER_STATE_TOKEN, userActions, UserState } from './user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService implements IUserService {
  private readonly githubOrgs = new BehaviorSubject<IGithubUserOrganization[]>([]);

  public readonly githubOrgs$ = this.githubOrgs.asObservable();

  private readonly publicEvents = new BehaviorSubject<IGithubUserPublicEvent<unknown>[]>([]);

  public readonly publicEvents$ = this.publicEvents.asObservable();

  public readonly userData$ = this.store.select(UserState.getState);

  public readonly languageIcons$ = this.store.select(UserState.getState).pipe(
    filter(state => typeof state.userConfig?.languageIcons !== 'undefined'),
    map(state => state.userConfig?.languageIcons),
  );

  /**
   * Constructor.
   */
  constructor(
    private readonly store: Store,
    private readonly userConfig: UserConfigService,
    private readonly github: GithubService,
  ) {}

  /**
   * Gets user data and updates state.
   */
  public getUserData() {
    return this.github.getGithubAccessToken().pipe(
      concatMap(() => this.getUserConfig()),
      concatMap(userConfig => {
        const username = userConfig.username.github;
        return combineLatest([
          this.getGithubProfile(username),
          this.getGithubUserOrganizations(username),
          this.getGithubUserPublicEvents(username),
          this.getGithubRepos(username),
        ]).pipe(
          map(([github, githubOrgs, publicEvents, githubRepos]) => ({
            userConfig,
            github,
            githubOrgs,
            publicEvents,
            githubRepos,
          })),
        );
      }),
    );
  }

  /**
   * Gets user config.
   */
  public getUserConfig() {
    return this.userConfig.getUserConfig().pipe(
      concatMap((data: IUserConfig) => {
        const userConfig = data;
        const profiles = data.profiles;
        return this.store
          .dispatch(new userActions.setUserState({ userConfig, profiles }))
          .pipe(mapTo(data));
      }),
    );
  }

  /**
   * Gets user Github profile.
   * @username github user name
   */
  public getGithubProfile(username: string) {
    return this.github.getProfile(username).pipe(
      concatMap((data: IGuthubUser) => {
        const github = data;
        return this.store.dispatch(new userActions.setUserState({ github })).pipe(mapTo(data));
      }),
    );
  }

  /**
   * Gets user Github repos.
   * @username github user name
   */
  public getGithubRepos(username: string) {
    return this.github.getRepos(username).pipe(
      concatMap((data: IGithubUserRepo[]) => {
        const githubRepos = data;
        return this.store
          .dispatch(new userActions.setUserState({ githubRepos }))
          .pipe(mapTo(githubRepos));
      }),
      concatMap((repos: IGithubUserRepo[]) => {
        const languageObservables: Observable<IGithubRepoLanguages>[] = [];
        for (let i = 0, max = repos.length; i < max; i = i + 1) {
          languageObservables.push(this.getGithubRepoLanguages(username, repos[i].name));
        }
        return combineLatest(languageObservables).pipe(mapTo(repos));
      }),
    );
  }

  /**
   * Gets user Github repo languages.
   * @username github user name
   * @repoName repository name
   */
  private getGithubRepoLanguages(username: string, repoName: string) {
    return this.github.getRepoLanguages(username, repoName).pipe(
      concatMap(data =>
        this.store.selectOnce(USER_STATE_TOKEN).pipe(map(state => ({ state, data }))),
      ),
      map(({ state, data }) => {
        const githubLanguages: IGithubRepoLanguages = { ...state.githubLanguages };
        const githubLanguagesRate = { ...state.githubLanguagesRate };
        const imgShow = { ...state.imgShow };
        let githubLanguagesKeys = Object.keys(githubLanguages);
        let githubLanguagesTotal = state.githubLanguagesTotal;
        // eslint-disable-next-line no-labels
        loop: for (const lang of Object.keys(data)) {
          if (lang.includes('$')) {
            // eslint-disable-next-line no-labels
            break loop;
          }
          githubLanguagesTotal += data[lang];
          githubLanguages[lang] = githubLanguages[lang]
            ? githubLanguages[lang] + data[lang]
            : data[lang];

          githubLanguagesKeys = Object.keys(githubLanguages);

          imgShow.languageIcons = githubLanguagesKeys.reduce((accumulator, key: string) => {
            accumulator[key] = true;
            return accumulator;
          }, {} as { [key: string]: boolean });

          const multiplier = 100;
          const fixed = 2;

          githubLanguagesRate[lang] = (
            (githubLanguages[lang] * multiplier) /
            githubLanguagesTotal
          ).toFixed(fixed);
        }
        void this.store.dispatch(
          new userActions.setUserState({
            githubLanguagesTotal,
            githubLanguages,
            imgShow,
            githubLanguagesKeys,
            githubLanguagesRate,
          }),
        );
        return data;
      }),
    );
  }

  /**
   * Gets Github user organizations.
   * @username github user name
   */
  public getGithubUserOrganizations(username: string) {
    return this.github.getUserOrganizations(username).pipe(
      concatMap((githubOrgs: IGithubUserOrganization[]) => {
        this.githubOrgs.next(githubOrgs);
        return this.store
          .dispatch(new userActions.setUserState({ githubOrgs }))
          .pipe(mapTo(githubOrgs));
      }),
    );
  }

  /**
   * Gets GitHub public events.
   * @username github user name
   */
  public getGithubUserPublicEvents(username: string) {
    return this.github.getPublicEvents(username).pipe(
      concatMap((publicEventsData: IGithubUserPublicEvent<unknown>[]) => {
        const publicEvents = publicEventsData.reverse();
        void timer(0)
          .pipe(
            tap(() => {
              this.publicEvents.next(publicEvents);
            }),
          )
          .subscribe();
        return this.store
          .dispatch(new userActions.setUserState({ publicEvents }))
          .pipe(mapTo(publicEvents));
      }),
    );
  }
}
