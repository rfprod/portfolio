import { HttpClient, HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogRefMock } from 'src/mocks/utils/refs/dialog-ref.mock';

import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { AppMaterialModule } from '../../modules/material/material.module';
import { HttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { WINDOW } from '../../services/providers.config';
import { SendEmailService } from '../../services/send-email/send-email.service';
import { AppContactComponent } from './contact.component';

describe('AppContactComponent', () => {
  const MOCKED_MODAL_DATA: Record<string, unknown> = {};

  let fixture: ComponentFixture<AppContactComponent>;
  let component: AppContactComponent;
  let httpController: HttpTestingController;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [AppContactComponent, DummyComponent],
      imports: [
        BrowserDynamicTestingModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        AppMaterialModule,
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
        {
          provide: MatSnackBar,
          useValue: {
            open: (): null => null,
          },
        },
        {
          provide: HttpHandlersService,
          useFactory: (snackBar: MatSnackBar) => new HttpHandlersService(snackBar),
          deps: [MatSnackBar],
        },
        {
          provide: SendEmailService,
          useFactory: (http: HttpClient, handlers: HttpHandlersService, window: Window) =>
            new SendEmailService(http, handlers, window),
          deps: [HttpClient, HttpHandlersService, WINDOW],
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
      .match((req: HttpRequest<unknown>): boolean => true)
      .forEach((req: TestRequest) => {
        req.flush({});
      });
    httpController.verify();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
