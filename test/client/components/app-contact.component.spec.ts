import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from '../../../public/src/services/event-emitter.service';

import { CustomHttpHandlersService } from '../../../public/src/services/custom-http-handlers.service';

import { SendEmailService } from '../../../public/src/services/send-email.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import '../../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from '../../../public/src/modules/custom-material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DummyComponent, DialogRefMock } from '../mocks/index';

import { AppContactComponent } from '../../../public/src/components/app-contact.component';

describe('AppContactComponent', () => {

	const MOCKED_MODAL_DATA: object = {};

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [ AppContactComponent, DummyComponent ],
			imports: [
				BrowserDynamicTestingModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule,
				HttpClientTestingModule, CustomMaterialModule, FlexLayoutModule,
				RouterTestingModule.withRoutes([
					{path: '', component: DummyComponent},
				])
			],
			providers: [
				{ provide: 'Window', useValue: window },
				{	provide: MAT_DIALOG_DATA, useValue: MOCKED_MODAL_DATA },
				{
					provide: MatDialogRef,
					useFactory: () => new DialogRefMock(),
					deps: []
				},
				EventEmitterService,
				CustomHttpHandlersService,
				{
					provide: SendEmailService,
					useFactory: (http, handlers, window) => new SendEmailService(http, handlers, window),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				}
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(AppContactComponent);
			this.component = this.fixture.componentInstance;
			this.eventEmitterSrv = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.eventEmitterSrv, 'emitEvent').and.callThrough();
			this.sendEmailService = TestBed.get(SendEmailService) as SendEmailService;
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			done();
		});
	});

	afterEach(() => {
		this.httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
		this.httpController.verify();
	});

	it('should be defined', () => {
		expect(this.component).toBeDefined();
	});

	it('should have variables defined', () => {
		expect(this.component.contactForm).toBeUndefined();
		expect(this.component.textValidator).toBeDefined();
		expect(this.component.inputError).toBeDefined();
		expect(this.component.resetForm).toEqual(jasmine.any(Function));
		expect(this.component.submitForm).toEqual(jasmine.any(Function));
		expect(this.component.sendMessage).toEqual(jasmine.any(Function));
		expect(this.component.closeDialog).toEqual(jasmine.any(Function));
		expect(this.component.ngOnInit).toEqual(jasmine.any(Function));
		expect(this.component.ngOnDestroy).toEqual(jasmine.any(Function));
	});

});
