import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from '../../public/src/services/event-emitter.service';
import { CustomDeferredService } from '../../public/src/services/custom-deferred.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from '../../public/src/modules/custom-material.module';

import { DummyComponent } from './mocks/index';

import { AppComponent } from '../../public/src/app.component';

describe('AppComponent', () => {

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [ AppComponent, DummyComponent ],
			imports: [ BrowserDynamicTestingModule, NoopAnimationsModule, CustomMaterialModule, FlexLayoutModule, RouterTestingModule.withRoutes([
				{path: '', component: DummyComponent},
			]) ],
			providers: [
				{ provide: 'Window', useValue: window },
				EventEmitterService
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(AppComponent);
			this.component = this.fixture.componentInstance;
			this.emitterService = TestBed.get(EventEmitterService) as EventEmitterService;
			done();
		});
	});

	it('should be defined', () => {
		expect(this.component).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.component.subscriptions).toEqual(jasmine.any(Array));
		expect(this.component.showSpinner).toEqual(jasmine.any(Boolean));
		expect(this.component.showSpinner).toBeFalsy();
		expect(this.component.startSpinner).toEqual(jasmine.any(Function));
		expect(this.component.stopSpinner).toEqual(jasmine.any(Function));
		expect(this.component.setDatepickerLocale).toEqual(jasmine.any(Function));
		expect(this.component.ngOnInit).toEqual(jasmine.any(Function));
		expect(this.component.ngOnDestroy).toEqual(jasmine.any(Function));
	});

	it('should control spinner correctly', () => {
		expect(this.component.showSpinner).toBeFalsy();
		this.component.startSpinner();
		expect(this.component.showSpinner).toBeTruthy();
		this.component.stopSpinner();
		expect(this.component.showSpinner).toBeFalsy();
	});

	it('should listen to event emitter and take action if message is correct', () => {
		this.component.ngOnInit();

		expect(this.component.showSpinner).toBeFalsy();
		this.emitterService.emitter.emit({ spinner: 'start' });
		expect(this.component.showSpinner).toBeTruthy();
		this.emitterService.emitter.emit({ spinner: 'stop' });
		expect(this.component.showSpinner).toBeFalsy();
		this.emitterService.emitter.emit({ spinner: 'ziii' });
		expect(this.component.showSpinner).toBeFalsy(); // nothing happens

		this.emitterService.emitter.emit({ unrecognized_key: 'value' }); //
		expect(this.component.showSpinner).toBeFalsy(); // nothing happens
	});

	it('should be properly destroyed', () => {
		this.component.ngOnInit();
		for (const sub of this.component.subscriptions) {
			spyOn(sub, 'unsubscribe').and.callThrough();
		}
		this.component.ngOnDestroy();
		for (const sub of this.component.subscriptions) {
			expect(sub.unsubscribe).toHaveBeenCalled();
		}
	});
});
