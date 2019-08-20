import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * Github service.
 */
@Injectable()
export class GithubService {

  /**
   * Constructor.
   * @param http Http client
   * @param handlers http handlers
   * @param window window reference
   */
  constructor(
    private http: HttpClient,
    private handlers: CustomHttpHandlersService,
    @Inject('Window') private window: Window
  ) {}

  /**
   * Github access token.
   */
  public githubAccessToken: string = environment.githubAccessToken;

  /**
   * Github api base url.
   */
  protected githubApiBaseUrl: string = 'https://api.github.com';

  /**
   * ServiceAPI endpoints.
   */
  private endpoints: {
    githubAccessToken: () => string,
    user: (username: string) => string,
    repos: (username: string) => string,
    languages: (username: string, reponame: string) => string
  } = {
    githubAccessToken: (): string => `${this.window.location.origin}/api/githubAccessToken`,
    user: (username: string): string => `${this.githubApiBaseUrl}/users/${username}?access_token=${this.githubAccessToken}`,
    repos: (username: string): string => `${this.githubApiBaseUrl}/users/${username}/repos?access_token=${this.githubAccessToken}`,
    languages: (username: string, reponame: string): string => `${this.githubApiBaseUrl}/repos/${username}/${reponame}/languages?access_token=${this.githubAccessToken}`
  };

  public getGithubAccessToken(): Observable<any> {
    return this.http.get(this.endpoints.githubAccessToken()).pipe(
      timeout(10000),
      take(1),
      map(this.handlers.extractObject),
      catchError(this.handlers.handleError)
    );
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
