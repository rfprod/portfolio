import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GithubService {

	constructor(
		private http: Http,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('GithubProfileService constructor');
	}

	private baseUrl: string = 'https://api.github.com';
	private endpoints: any = {
		user: (username: string) => `/users/${username}`,
		repos: (username: string) => `/users/${username}/repos`,
		languages: (username: string, reponame: string) => `/users/${username}/${reponame}/languages`
	};

	public getProfile(username: string): Observable<any> {
		return this.http.get(this.baseUrl + this.endpoints.user(username))
			.timeout(10000)
			.map(this.handlers.extractObject)
			.catch(this.handlers.handleError);
	}

	public getRepos(username: string): Observable<any> {
		return this.http.get(this.baseUrl + this.endpoints.repos(username))
			.timeout(10000)
			.map(this.handlers.extractArray)
			.catch(this.handlers.handleError);
	}

	public getRepoLanguages(username: string, repo: string): Observable<any> {
		return this.http.get(this.baseUrl + this.endpoints.languages(username, repo))
			.timeout(10000)
			.map(this.handlers.extractObject)
			.catch(this.handlers.handleError);
	}
}
