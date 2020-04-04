import { HttpClient, HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppContactComponent } from 'src/app/components/contact/app-contact.component';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';
import { WINDOW } from 'src/app/services/app-services.module';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';
import { DialogRefMock, DummyComponent } from 'src/mocks/index';

describe('AppContactComponent', () => {
  const MOCKED_MODAL_DATA: object = {};

  let fixture: ComponentFixture<AppContactComponent>;
  let component: AppContactComponent | any;
  let httpController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppContactComponent, DummyComponent],
      imports: [
        BrowserDynamicTestingModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        CustomMaterialModule,
        FlexLayoutModule,
        RouterTestingModule.withRoutes([{ path: '', component: DummyComponent }]),
      ],
      providers: [
        { provide: WINDOW, useValue: window },
        { provide: MAT_DIALOG_DATA, useValue: MOCKED_MODAL_DATA },
        {
          provide: MatDialogRef,
          useFactory: () => new DialogRefMock(),
          deps: [],
        },
        CustomHttpHandlersService,
        {
          provide: SendEmailService,
          useFactory: (http, handlers, window) => new SendEmailService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, WINDOW],
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppContactComponent);
        component = fixture.componentInstance;
        httpController = TestBed.inject(HttpTestingController);
      });
  }));

  afterEach(() => {
    httpController
      .match((req: HttpRequest<any>): boolean => true)
      .forEach((req: TestRequest) => {
        req.flush({});
      });
    httpController.verify();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
