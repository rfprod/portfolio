import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

/**
 * Github service.
 */
@Injectable()
export class GithubService {

  /**
   * Github access token.
   */
  public githubAccessToken: string = environment.githubAccessToken;

  /**
   * Github api base url.
   */
  protected githubApiBaseUrl = 'https://api.github.com';

  /**
   * ServiceAPI endpoints.
   */
  private readonly endpoints: {
    githubAccessToken(): string;
    user(username: string): string;
    repos(username: string): string;
    languages(username: string, reponame: string): string;
  } = {
    githubAccessToken: (): string => `${this.window.location.origin}/api/githubAccessToken`,
    user: (username: string): string => `${this.githubApiBaseUrl}/users/${username}?access_token=${this.githubAccessToken}`,
    repos: (username: string): string => `${this.githubApiBaseUrl}/users/${username}/repos?access_token=${this.githubAccessToken}`,
    languages: (username: string, reponame: string) => `${this.githubApiBaseUrl}/repos/${username}/${reponame}/languages?access_token=${this.githubAccessToken}`,
  };

  /**
   * Constructor.
   * @param http Http client
   * @param handlers http handlers
   * @param window window reference
   */
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {}

  public getGithubAccessToken(): Observable<any> {
    return this.http.get(this.endpoints.githubAccessToken()).pipe(
      take(1),
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }

  /**
   * Gets Github user profile.
   * @param username Github username
   */
  public getProfile(username: string): Observable<any> {
    return this.http.get(this.endpoints.user(username)).pipe(
      take(1),
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }

  /**
   * Gets Github user repos.
   * @param username Github username
   */
  public getRepos(username: string): Observable<any> {
    return this.http.get(this.endpoints.repos(username)).pipe(
      take(1),
      map((res: any[]) => this.handlers.extractArray(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }

  /**
   * Get Github user repo languages.
   * @param username Github username
   * @param repo Github repo name
   */
  public getRepoLanguages(username: string, repo: string): Observable<any> {
    return this.http.get(this.endpoints.languages(username, repo)).pipe(
      take(1),
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }
}
