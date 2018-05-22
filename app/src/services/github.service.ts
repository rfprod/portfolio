import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class GithubService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('GithubProfileService constructor');
	}

	private baseUrl: string = 'https://api.github.com';
	private tk: string = 'GITHUB_ACCESS_TOKEN';
	private endpoints: any = {
		user: (username: string) => `/users/${username}?access_token=${this.tk}`,
		repos: (username: string) => `/users/${username}/repos?access_token=${this.tk}`,
		languages: (username: string, reponame: string) => `/repos/${username}/${reponame}/languages?access_token=${this.tk}`
	};

	public getProfile(username: string): Observable<any> {
		return this.http.get(this.baseUrl + this.endpoints.user(username)).pipe(
			timeout(10000),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}

	public getRepos(username: string): Observable<any> {
		return this.http.get(this.baseUrl + this.endpoints.repos(username)).pipe(
			timeout(10000),
			take(1),
			map(this.handlers.extractArray),
			catchError(this.handlers.handleError)
		);
	}

	public getRepoLanguages(username: string, repo: string): Observable<any> {
		return this.http.get(this.baseUrl + this.endpoints.languages(username, repo)).pipe(
			timeout(10000),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}
}
