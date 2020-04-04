import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  IGithubAccessToken,
  IGithubApiEngpoints,
  IGithubOrganization,
  IGithubRepoLanguages,
  IGithubUserOrganization,
  IGithubUserRepo,
  IGuthubUser,
} from 'src/app/interfaces';
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
  private githubAccessToken = '';

  /**
   * Github api base url.
   */
  private readonly githubApiBaseUrl = 'https://api.github.com';

  /**
   * ServiceAPI endpoints.
   */
  private readonly endpoints: IGithubApiEngpoints = {
    githubAccessToken: (): string => `${this.win.location.origin}/api/githubAccessToken`,
    user: (username: string): string => `${this.githubApiBaseUrl}/users/${username}`,
    repos: (username: string): string => `${this.githubApiBaseUrl}/users/${username}/repos`,
    languages: (username: string, reponame: string) =>
      `${this.githubApiBaseUrl}/repos/${username}/${reponame}/languages`,
    organizations: (username: string): string => `${this.githubApiBaseUrl}/users/${username}/orgs`,
    organization: (organization: string): string => `${this.githubApiBaseUrl}/orgs/${organization}`,
  };

  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  public getGithubAccessToken(): Observable<IGithubAccessToken> {
    const url = this.endpoints.githubAccessToken();
    return this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IGithubAccessToken) => {
        this.githubAccessToken = res.token;
        return res;
      }),
    );
  }

  /**
   * Gets Github user profile.
   * @param username Github username
   */
  public getProfile(username: string): Observable<IGuthubUser> {
    const url = this.endpoints.user(username);
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IGuthubUser) => res),
    );
  }

  /**
   * Gets Github user repos.
   * @param username Github username
   */
  public getRepos(username: string): Observable<IGithubUserRepo[]> {
    const url = this.endpoints.repos(username);
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IGithubUserRepo[]) => res),
    );
  }

  /**
   * Get Github user repo languages.
   * @param username Github username
   * @param repo Github repo name
   */
  public getRepoLanguages(username: string, repo: string): Observable<IGithubRepoLanguages> {
    const url = this.endpoints.languages(username, repo);
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IGithubRepoLanguages) => res),
    );
  }

  /**
   * Get Github user organizations.
   * @param username Github username
   */
  public getUserOrganizations(username: string): Observable<IGithubUserOrganization[]> {
    const url = this.endpoints.organizations(username);
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IGithubUserOrganization[]) => res),
    );
  }

  /**
   * Get Github organization by name.
   * @param username Github organization name
   */
  public getOrganization(organization: string): Observable<IGithubOrganization> {
    const url = this.endpoints.organization(organization);
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handlers.handleError(error)),
      map((res: IGithubOrganization) => res),
    );
  }

  private getAuthHeaders() {
    return new HttpHeaders({ Authorization: `token ${this.githubAccessToken}` });
  }
}
