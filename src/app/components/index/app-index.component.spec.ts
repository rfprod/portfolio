import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';

import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

import { GithubService } from 'src/app/services/github/github.service';
import { UserConfigService } from 'src/app/services/user-config/user-config.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';

import { DummyComponent } from 'src/mocks/index';

import { AppIndexComponent } from 'src/app/components/index/app-index.component';

describe('AppIndexComponent', () => {

  let fixture: ComponentFixture<AppIndexComponent>;
  let component: AppIndexComponent|any;
  let emitter: EventEmitterService;
  let userConfig: UserConfigService;
  let github: GithubService;
  let httpController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIndexComponent, DummyComponent ],
      imports: [
        BrowserDynamicTestingModule, NoopAnimationsModule, HttpClientTestingModule,
        CustomMaterialModule, FlexLayoutModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: 'Window', useValue: window },
        EventEmitterService,
        CustomHttpHandlersService,
        {
          provide: UserConfigService,
          useFactory: (http, handlers, window) => new UserConfigService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, 'Window'],
        },
        {
          provide: GithubService,
          useFactory: (http, window, handlers) => new GithubService(http, window, handlers),
          deps: [HttpClient, 'Window', CustomHttpHandlersService],
        },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppIndexComponent);
      component = fixture.componentInstance;
      emitter = TestBed.inject(EventEmitterService);
      spyOn(emitter, 'emitEvent').and.callThrough();
      userConfig = TestBed.inject(UserConfigService);
      github = TestBed.inject(GithubService);
      httpController = TestBed.inject(HttpTestingController);
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
    expect(component.data).toEqual(jasmine.objectContaining({
      profiles: jasmine.any(Array),
      userConfig: jasmine.any(Object),
      github: jasmine.any(Object),
      githubRepos: jasmine.any(Array),
      githubLanguages: jasmine.any(Object),
      githubLanguagesKeys: jasmine.any(Array),
    }));
    expect(component.getUserConfig).toEqual(jasmine.any(Function));
    expect(component.getGithubProfile).toEqual(jasmine.any(Function));
    expect(component.getGithubRepos).toEqual(jasmine.any(Function));
    expect(component.getGithubRepoLanguages).toEqual(jasmine.any(Function));
    expect(component.dialogInstance).toBeUndefined();
    expect(component.dialogSub).toBeUndefined();
    expect(component.showContactDialog).toEqual(jasmine.any(Function));
    expect(component.imgShow).toEqual(jasmine.objectContaining({
      github: jasmine.any(Boolean),
      codepen: jasmine.any(Boolean),
      codewars: jasmine.any(Boolean),
      hackerrank: jasmine.any(Boolean),
    }));
    expect(component.showImage).toEqual(jasmine.any(Function));
    expect(component.imgLoaded).toEqual(jasmine.any(Function));
    expect(component.imgError).toEqual(jasmine.any(Function));
    expect(component.ngOnInit).toEqual(jasmine.any(Function));
    expect(component.ngOnDestroy).toEqual(jasmine.any(Function));
  });

});
