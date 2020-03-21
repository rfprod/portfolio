import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WINDOW } from '../app-services.module';
import { CustomHttpHandlersService } from '../http-handlers/custom-http-handlers.service';

/**
 * Github service.
 */
@Injectable({
  providedIn: 'root',
})
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
    user: (username: string): string => `${this.githubApiBaseUrl}/users/${username}`,
    repos: (username: string): string => `${this.githubApiBaseUrl}/users/${username}/repos`,
    languages: (username: string, reponame: string) =>
      `${this.githubApiBaseUrl}/repos/${username}/${reponame}/languages`,
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
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  public getGithubAccessToken(): Observable<any> {
    const url = this.endpoints.githubAccessToken();
    return this.http.get(url).pipe(
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }

  /**
   * Gets Github user profile.
   * @param username Github username
   */
  public getProfile(username: string): Observable<any> {
    const url = this.endpoints.user(username);
    const headers = new HttpHeaders({ Authorization: `token ${this.githubAccessToken}` });
    return this.http.get(url, { headers }).pipe(
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }

  /**
   * Gets Github user repos.
   * @param username Github username
   */
  public getRepos(username: string): Observable<any> {
    const url = this.endpoints.repos(username);
    const headers = new HttpHeaders({ Authorization: `token ${this.githubAccessToken}` });
    return this.http.get(url, { headers }).pipe(
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
    const url = this.endpoints.languages(username, repo);
    const headers = new HttpHeaders({ Authorization: `token ${this.githubAccessToken}` });
    return this.http.get(url, { headers }).pipe(
      map(res => this.handlers.extractObject(res)),
      catchError(error => this.handlers.handleError(error)),
    );
  }
}
