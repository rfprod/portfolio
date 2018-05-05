import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserConfigService {

	constructor(
		private http: Http,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('UserConfigService constructor');
	}

	private url: string = this.window.location.origin + '/data/config.json';

	public getData(): Observable<any> {
		return this.http.get(this.url)
			.timeout(10000)
			.map(this.handlers.extractObject)
			.catch(this.handlers.handleError);
	}
}
