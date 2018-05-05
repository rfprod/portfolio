import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CodepenService {

	constructor(
		private http: Http,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('CodepenService constructor');
	}

	private url: string = 'https://cpv2api.com/profile/';

	public getProfile(username: string): Observable<any> {
		return this.http.get(this.url + username)
			.timeout(10000)
			.map(this.handlers.extractObject)
			.catch(this.handlers.handleError);
	}
}
