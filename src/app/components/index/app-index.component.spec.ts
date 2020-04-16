import { HttpClient, HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { CustomMaterialModule } from '../../modules/material/custom-material.module';
import { GithubService } from '../../services/github/github.service';
import { CustomHttpHandlersService } from '../../services/http-handlers/custom-http-handlers.service';
import { WINDOW } from '../../services/providers.config';
import { UserConfigService } from '../../services/user-config/user-config.service';
import { AppIndexComponent } from './app-index.component';

describe('AppIndexComponent', () => {
  let fixture: ComponentFixture<AppIndexComponent>;
  let component: AppIndexComponent | any;
  let httpController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppIndexComponent, DummyComponent],
      imports: [
        BrowserDynamicTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        CustomMaterialModule,
        FlexLayoutModule,
        RouterTestingModule.withRoutes([{ path: '', component: DummyComponent }]),
      ],
      providers: [
        { provide: WINDOW, useValue: window },
        CustomHttpHandlersService,
        {
          provide: UserConfigService,
          useFactory: (http: HttpClient, handlers: CustomHttpHandlersService, window: Window) =>
            new UserConfigService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, WINDOW],
        },
        {
          provide: GithubService,
          useFactory: (http: HttpClient, handlers: CustomHttpHandlersService, window: Window) =>
            new GithubService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, WINDOW],
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppIndexComponent);
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
