import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { DateAdapter } from '@angular/material';

import { EventEmitterService } from './services/event-emitter.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
	selector: 'root',
	template: `
		<router-outlet></router-outlet>
		<span id="spinner" *ngIf="showSpinner">
			<mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
		</span>
	`
})
export class AppComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private router: Router,
		private dateAdapter: DateAdapter<any>,
		private emitter: EventEmitterService,
		@Inject('Window') private window: Window
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	private ngUnsubscribe: Subject<void> = new Subject();

	public showSpinner: boolean = false;

	private startSpinner(): void {
		console.log('spinner start');
		this.showSpinner = true;
	}
	private stopSpinner(): void {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	private setDatepickersLocale(key: string): void {
		this.dateAdapter.setLocale('en');
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppComponent initialized');

		this.emitter.getEmitter().takeUntil(this.ngUnsubscribe).subscribe((event: any) => {
			console.log('app consuming event:', event);
			if (event.spinner) {
				if (event.spinner === 'start') {
					console.log('starting spinner');
					this.startSpinner();
				} else if (event.spinner === 'stop') {
					console.log('stopping spinner');
					this.stopSpinner();
				}
			}
		});

		this.dateAdapter.localeChanges.takeUntil(this.ngUnsubscribe).subscribe(() => {
			console.log('dateAdapter.localeChanges, changed according to the language');
		});
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

}
