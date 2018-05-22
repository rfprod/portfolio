import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class SendEmailService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('SendEmailService constructor');
	}

	private url: string = this.window.location.origin + '/sendEmail';

	public sendEmail(formData: any): Observable<any> {
		return this.http.post(this.url, formData).pipe(
			timeout(10000),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}
}
