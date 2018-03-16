'use strict';

describe('portfolio.userPanel module', () => {

	beforeEach(module('angularSpinner'));
	beforeEach(module('ngTemplates'));
	beforeEach(module('portfolio.userPanel'));
	beforeEach(module('portfolio.httpServices'));

	describe('UserPanelController', () => {
		let scope, ctrl, httpBackend, usSpinnerService, UserConfigService, GetGithubProfileService, GetGithubUserReposService, GetGithubRepoLanguagesService, GetCodepenProfileService, GetCodewarsProfileService;

		beforeEach(inject(($rootScope, $controller, $httpBackend, _usSpinnerService_, _UserConfigService_, _GetGithubProfileService_, _GetGithubUserReposService_, _GetGithubRepoLanguagesService_, _GetCodepenProfileService_, _GetCodewarsProfileService_) => {
			scope = $rootScope.$new();
			httpBackend = $httpBackend;
			usSpinnerService = _usSpinnerService_;
			spyOn(usSpinnerService, 'spin').and.callThrough();
			spyOn(usSpinnerService, 'stop').and.callThrough();
			UserConfigService = _UserConfigService_;
			spyOn(UserConfigService, 'query').and.callThrough();
			GetGithubProfileService = _GetGithubProfileService_;
			spyOn(GetGithubProfileService, 'query').and.callThrough();
			GetGithubUserReposService = _GetGithubUserReposService_;
			spyOn(GetGithubUserReposService, 'query').and.callThrough();
			GetGithubRepoLanguagesService = _GetGithubRepoLanguagesService_;
			spyOn(GetGithubRepoLanguagesService, 'query').and.callThrough();
			GetCodewarsProfileService = _GetCodewarsProfileService_;
			spyOn(GetCodewarsProfileService, 'query').and.callThrough();
			GetCodepenProfileService = _GetCodepenProfileService_;
			spyOn(GetCodepenProfileService, 'query').and.callThrough();
			ctrl = $controller('UserPanelController', {$scope:scope, usSpinnerService:_usSpinnerService_, UserConfigService:_UserConfigService_, GetGithubProfileService:_GetGithubProfileService_, GetGithubUserReposService:_GetGithubUserReposService_, GetCodewarsProfileService:_GetCodewarsProfileService_, GetCodepenProfileService:_GetCodepenProfileService_});
			spyOn(scope, 'getUserConfig').and.callThrough();
			spyOn(scope, 'getGithubProfile').and.callThrough();
			spyOn(scope, 'getCodepenProfile').and.callThrough();
			spyOn(scope, 'getCodewarsProfile').and.callThrough();

			httpBackend.when('GET', 'http://localhost:7070/data/config.json').respond(() => {
				return [200, {github: 'test', codewars: 'test', codepen: 'test'}, {}];
			});
			httpBackend.when('GET', 'https://api.github.com/users/test').respond(() => {
				return [200, {test: 'test'}, {}];
			});
			httpBackend.when('GET', 'http://cpv2api.com/profile/test').respond(() => {
				return [200, {data: {test: 'test'}}, {}];
			});
			httpBackend.when('GET', 'https://www.codewars.com/api/v1/users/test').respond(() => {
				return [200, {test: 'test'}, {}];
			});

		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables in initial state and method', () => {
			expect(scope.displayError).toBeUndefined();
			expect(scope.loading).toBeDefined();
			expect(scope.loading).toBeFalsy();
			expect(scope.userConfig).toEqual(jasmine.any(Object));
			expect(scope.links).toEqual(jasmine.objectContaining({
				github: jasmine.any(String),
				hackerrank: jasmine.any(String),
				codewars: jasmine.any(String),
				codepen: jasmine.any(String)
			}));
			expect(scope.data).toEqual(jasmine.any(Object));
			expect(scope.data).toEqual(jasmine.objectContaining({
				github: jasmine.any(Object),
				githubRepos: jasmine.any(Array),
				githubLanguages: jasmine.any(Object),
				codewars: jasmine.any(Object),
				codepen: jasmine.any(Object)
			}));
			expect(scope.getUserConfig).toBeDefined();
			expect(scope.getGithubProfile).toBeDefined();
			expect(scope.getGithubRepos).toBeDefined();
			expect(scope.getGithubRepoLanguages).toBeDefined();
			expect(scope.getCodepenProfile).toBeDefined();
			expect(scope.getCodewarsProfile).toBeDefined();
		});

		it('should start a spinner if loading is in progress', () => {
			scope.loading = true;
			scope.$apply();
			expect(usSpinnerService.spin).toHaveBeenCalledWith('root-spinner');
		});

		it('should stop a spinner if loading is finished', () => {
			scope.loading = true;
			scope.$apply();
			expect(usSpinnerService.spin).toHaveBeenCalledWith('root-spinner');
			scope.loading = false;
			scope.$apply();
			expect(usSpinnerService.stop).toHaveBeenCalledWith('root-spinner');
		});

		it('should call UserConfigService on a respective method call', () => {
			scope.getUserConfig();
			expect(UserConfigService.query).toHaveBeenCalled();
		});

		it('should call GetGithubProfileService on a respective method call', () => {
			scope.userConfig.username = {};
			scope.userConfig.username.github = 'test';
			scope.$apply();
			scope.getGithubProfile();
			expect(GetGithubProfileService.query).toHaveBeenCalled();
		});

		it('should call GetCodepenProfileService on a respective method call', () => {
			scope.userConfig.username = {};
			scope.userConfig.username.codepen = 'test';
			scope.$apply();
			scope.getCodepenProfile();
			expect(GetCodepenProfileService.query).toHaveBeenCalled();
		});

		it('should call GetCodewarsProfileService on a respective method call', () => {
			scope.userConfig.username = {};
			scope.userConfig.username.codewars = 'test';
			scope.$apply();
			scope.getCodewarsProfile();
			expect(GetCodewarsProfileService.query).toHaveBeenCalled();
		});

		it('should init on $viewContentLoaded', () => {
			scope.$broadcast('$viewContentLoaded');
			expect(scope.getUserConfig).toHaveBeenCalled();
			expect(UserConfigService.query).toHaveBeenCalled();
		});

	});
});
