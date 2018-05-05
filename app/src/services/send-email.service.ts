import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SendEmailService {

	constructor(
		private http: Http,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('SendEmailService constructor');
	}

	private url: string = this.window.location.origin + '/sendEmail';

	public sendEmail(formData: any): Observable<any> {
		return this.http.post(this.url, formData)
			.timeout(10000)
			.map(this.handlers.extractObject)
			.catch(this.handlers.handleError);
	}
}
