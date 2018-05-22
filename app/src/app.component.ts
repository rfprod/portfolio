import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { DateAdapter } from '@angular/material';

import { EventEmitterService } from './services/event-emitter.service';

@Component({
	selector: 'root',
	template: `
		<router-outlet></router-outlet>
		<span id="spinner" *ngIf="showSpinner">
			<mat-progress-spinner mode="indeterminate" aria-label="Application loading indicator"></mat-progress-spinner>
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

	private subscriptions: any[] = [];

	public showSpinner: boolean = false;

	private startSpinner(): void {
		console.log('spinner start');
		this.showSpinner = true;
	}
	private stopSpinner(): void {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	private setDatepickerLocale(): void {
		this.dateAdapter.setLocale('en');
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppComponent initialized');

		this.setDatepickerLocale();

		let sub = this.emitter.getEmitter().subscribe((event: any) => {
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
		this.subscriptions.push(sub);

		sub = this.dateAdapter.localeChanges.subscribe(() => {
			console.log('dateAdapter.localeChanges, changed according to the language');
		});
		this.subscriptions.push(sub);
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}

}
