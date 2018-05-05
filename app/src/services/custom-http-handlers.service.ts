import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class CustomHttpHandlersService {

	public extractObject(res: Response): object {
		return (res) ? res.json() : {};
	}

	public extractArray(res: Response): any[] {
		return (res) ? res.json() : [];
	}

	public handleError(error: any): any {
		const errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		return Observable.throw(errMsg);
	}

}
