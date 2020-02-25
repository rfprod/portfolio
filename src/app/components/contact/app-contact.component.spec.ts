import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';

import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

import { SendEmailService } from 'src/app/services/send-email/send-email.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';

import { DialogRefMock, DummyComponent } from 'src/mocks/index';

import { AppContactComponent } from 'src/app/components/contact/app-contact.component';

describe('AppContactComponent', () => {

  const MOCKED_MODAL_DATA: object = {};

  let fixture: ComponentFixture<AppContactComponent>;
  let component: AppContactComponent|any;
  let emitter: EventEmitterService;
  let email: SendEmailService;
  let httpController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppContactComponent, DummyComponent ],
      imports: [
        BrowserDynamicTestingModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, CustomMaterialModule, FlexLayoutModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: 'Window', useValue: window },
        {	provide: MAT_DIALOG_DATA, useValue: MOCKED_MODAL_DATA },
        {
          provide: MatDialogRef,
          useFactory: () => new DialogRefMock(),
          deps: [],
        },
        EventEmitterService,
        CustomHttpHandlersService,
        {
          provide: SendEmailService,
          useFactory: (http, handlers, window) => new SendEmailService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, 'Window'],
        },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppContactComponent);
      component = fixture.componentInstance;
      emitter = TestBed.inject(EventEmitterService) as EventEmitterService;
      spyOn(emitter, 'emitEvent').and.callThrough();
      email = TestBed.inject(SendEmailService) as SendEmailService;
      httpController = TestBed.inject(HttpTestingController) as HttpTestingController;
    });
  }));

  afterEach(() => {
    httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
    httpController.verify();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should have variables defined', () => {
    expect(component.contactForm).toBeUndefined();
    expect(component.textValidator).toBeDefined();
    expect(component.inputError).toBeDefined();
    expect(component.resetForm).toEqual(jasmine.any(Function));
    expect(component.submitForm).toEqual(jasmine.any(Function));
    expect(component.sendMessage).toEqual(jasmine.any(Function));
    expect(component.closeDialog).toEqual(jasmine.any(Function));
    expect(component.ngOnInit).toEqual(jasmine.any(Function));
    expect(component.ngOnDestroy).toEqual(jasmine.any(Function));
  });

});
