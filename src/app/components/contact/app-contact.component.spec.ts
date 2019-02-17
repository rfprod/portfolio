import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';

import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

import { SendEmailService } from 'src/app/services/send-email/send-email.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DummyComponent, DialogRefMock } from 'src/mocks/index';

import { AppContactComponent } from 'src/app/components/contact/app-contact.component';
import { UtilsService } from 'src/app/services/utils/utils.service';

describe('AppContactComponent', () => {

  const MOCKED_MODAL_DATA: object = {};

  let fixture: ComponentFixture<AppContactComponent>;
  let component: AppContactComponent;
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
        UtilsService,
        {
          provide: SendEmailService,
          useFactory: (http, handlers, window) => new SendEmailService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, 'Window']
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppContactComponent);
      component = fixture.componentInstance;
      emitter = TestBed.get(EventEmitterService) as EventEmitterService;
      spyOn(emitter, 'emitEvent').and.callThrough();
      email = TestBed.get(SendEmailService) as SendEmailService;
      httpController = TestBed.get(HttpTestingController) as HttpTestingController;
    });
  }));

  afterEach(() => {
    httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
    httpController.verify();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should have variables defined', function() {
    this.component = component;

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
