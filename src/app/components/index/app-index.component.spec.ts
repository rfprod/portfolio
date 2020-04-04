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
import { AppIndexComponent } from 'src/app/components/index/app-index.component';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';
import { WINDOW } from 'src/app/services/app-services.module';
import { GithubService } from 'src/app/services/github/github.service';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';
import { UserConfigService } from 'src/app/services/user-config/user-config.service';
import { DummyComponent } from 'src/mocks/index';

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
          useFactory: (http, handlers, window) => new UserConfigService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, WINDOW],
        },
        {
          provide: GithubService,
          useFactory: (http, handlers, window) => new GithubService(http, handlers, window),
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
