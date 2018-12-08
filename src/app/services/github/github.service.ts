import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * Github service.
 */
@Injectable()
export class GithubService {

  /**
   * @param http Http client
   * @param handlers http handlers
   * @param window window reference
   */
  constructor(
    private http: HttpClient,
    private handlers: CustomHttpHandlersService,
    @Inject('Window') private window: Window
  ) {
    console.log('GithubProfileService constructor');
  }

  /**
   * ServiceAPI endpoints.
   */
  private endpoints: any = {
    user: (username: string) => `${this.window.location.origin}/api/githubUser?username=${username}`,
    repos: (username: string) => `${this.window.location.origin}/api/githubUserRepos?username=${username}`,
    languages: (username: string, reponame: string) => `${this.window.location.origin}/api/githubUserReposLanguages?username=${username}&reponame=${reponame}`
  };

  /**
   * Gets Github user profile.
   * @param username Github username
   */
  public getProfile(username: string): Observable<any> {
    return this.http.get(this.endpoints.user(username)).pipe(
      timeout(10000),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
  }

  /**
   * Gets Github user repos.
   * @param username Github username
   */
  public getRepos(username: string): Observable<any> {
    return this.http.get(this.endpoints.repos(username)).pipe(
      timeout(10000),
      take(1),
      map(this.handlers.extractArray),
      catchError(this.handlers.handleError)
    );
  }

  /**
   * Get Github user repo languages.
   * @param username Github username
   * @param repo Github repo name
   */
  public getRepoLanguages(username: string, repo: string): Observable<any> {
    return this.http.get(this.endpoints.languages(username, repo)).pipe(
      timeout(10000),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
  }
}
