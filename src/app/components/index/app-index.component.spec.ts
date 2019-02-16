import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from '../../services/emitter/event-emitter.service';

import { CustomHttpHandlersService } from '../../services/http-handlers/custom-http-handlers.service';

import { UserConfigService } from '../../services/user-config/user-config.service';
import { GithubService } from '../../services/github/github.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../../modules/material/custom-material.module';

import { DummyComponent } from '../../../mocks/index';

import { AppIndexComponent } from '../../components/index/app-index.component';
import { UtilsService } from 'src/app/services/utils/utils.service';

describe('AppIndexComponent', () => {

  let fixture: ComponentFixture<AppIndexComponent>;
  let component: AppIndexComponent;
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
        ])
      ],
      providers: [
        { provide: 'Window', useValue: window },
        EventEmitterService,
        CustomHttpHandlersService,
        UtilsService,
        {
          provide: UserConfigService,
          useFactory: (http, handlers, window) => new UserConfigService(http, handlers, window),
          deps: [HttpClient, CustomHttpHandlersService, 'Window']
        },
        {
          provide: GithubService,
          useFactory: (http, window, handlers) => new GithubService(http, window, handlers),
          deps: [HttpClient, 'Window', CustomHttpHandlersService]
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppIndexComponent);
      component = fixture.componentInstance;
      emitter = TestBed.get(EventEmitterService) as EventEmitterService;
      spyOn(emitter, 'emitEvent').and.callThrough();
      userConfig = TestBed.get(UserConfigService) as UserConfigService;
      github = TestBed.get(GithubService) as GithubService;
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

    expect(this.component.data).toEqual(jasmine.objectContaining({
      links: {
        codewars: jasmine.any(String),
        hackerrank: jasmine.any(String),
        github: jasmine.any(String),
        codepen: jasmine.any(String)
      },
      userConfig: jasmine.any(Object),
      github: jasmine.any(Object),
      githubRepos: jasmine.any(Array),
      githubLanguages: jasmine.any(Object),
      githubLanguagesKeys: jasmine.any(Array)
    }));
    expect(this.component.getUserConfig).toEqual(jasmine.any(Function));
    expect(this.component.getGithubProfile).toEqual(jasmine.any(Function));
    expect(this.component.getGithubRepos).toEqual(jasmine.any(Function));
    expect(this.component.getGithubRepoLanguages).toEqual(jasmine.any(Function));
    expect(this.component.dialogInstance).toBeUndefined();
    expect(this.component.dialogSub).toBeUndefined();
    expect(this.component.showContactDialog).toEqual(jasmine.any(Function));
    expect(this.component.imgShow).toEqual(jasmine.objectContaining({
      githubLogo: jasmine.any(Boolean),
      codepenLogo: jasmine.any(Boolean),
      codewarsLogo: jasmine.any(Boolean),
      codewarsBadge: jasmine.any(Boolean),
      hackerrankLogo: jasmine.any(Boolean)
    }));
    expect(this.component.showImage).toEqual(jasmine.any(Function));
    expect(this.component.imgLoaded).toEqual(jasmine.any(Function));
    expect(this.component.imgError).toEqual(jasmine.any(Function));
    expect(this.component.ngOnInit).toEqual(jasmine.any(Function));
    expect(this.component.ngOnDestroy).toEqual(jasmine.any(Function));
  });

});
