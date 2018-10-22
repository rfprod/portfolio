import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from '../../../public/src/services/event-emitter.service';

import { CustomHttpHandlersService } from '../../../public/src/services/custom-http-handlers.service';

import { UserConfigService } from '../../../public/src/services/user-config.service';
import { GithubService } from '../../../public/src/services/github.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import '../../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from '../../../public/src/modules/custom-material.module';

import { DummyComponent } from '../mocks/index';

import { AppIndexComponent } from '../../../public/src/components/app-index.component';

describe('AppIndexComponent', () => {

	beforeEach((done) => {
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
			this.fixture = TestBed.createComponent(AppIndexComponent);
			this.component = this.fixture.componentInstance;
			this.eventEmitterSrv = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.eventEmitterSrv, 'emitEvent').and.callThrough();
			this.userConfigService = TestBed.get(UserConfigService) as UserConfigService;
			this.githubSerice = TestBed.get(GithubService) as GithubService;
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
