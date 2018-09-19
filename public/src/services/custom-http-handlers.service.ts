import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class CustomHttpHandlersService {

	public extractObject(res: object): object {
		return res || {};
	}

	public extractArray(res: any[]): any[] {
		return res || [];
	}

	public handleError(error: any): any {
		const errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		return errMsg;
	}

}
