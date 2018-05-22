import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventEmitterService {

	/**
	 * Event emitter instance.
	 */
	private emitter: EventEmitter<object> = new EventEmitter();

	/**
	 * Returns event emitter instance.
	 */
	public getEmitter() {
		return this.emitter;
	}

	/**
	 * Emits arbitrary event.
	 */
	public emitEvent(object: object): any {
		this.emitter.emit(object);
	}

	/**
	 * Emits spinner start event.
	 */
	public emitSpinnerStartEvent(): void {
		this.emitter.emit({spinner: 'start'});
	}

	/**
	 * Emits spinner stop event.
	 */
	public emitSpinnerStopEvent(): void {
		this.emitter.emit({spinner: 'stop'});
	}
}
