'use strict';

angular.module('portfolio.userPanel', ['ngRoute', 'ngSanitize'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/user-panel/user-panel.html',
			controller: 'UserPanelController'
		});
	}])

	.controller('UserPanelController', ['$scope', '$location', '$timeout', 'usSpinnerService', 'UserConfigService', 'SendEmailService', 'GetGithubProfileService', 'GetGithubUserReposService', 'GetGithubRepoLanguagesService', 'GetCodewarsProfileService', 'GetCodepenProfileService',
		function($scope, $location, $timeout, usSpinnerService, UserConfigService, SendEmailService, GetGithubProfileService, GetGithubUserReposService, GetGithubRepoLanguagesService, GetCodewarsProfileService, GetCodepenProfileService) {
			$scope.displayError = undefined;
			$scope.loading = false;
			$scope.$watch('loading',function(newValue){
				if (newValue) { usSpinnerService.spin('root-spinner'); }
				if (!newValue) { usSpinnerService.stop('root-spinner'); }
			});

			$scope.userConfig = {};
			$scope.links = {
				codewars: 'https://www.codewars.com/users/',
				hackerrank: 'https://www.hackerrank.com/',
				github: 'https://github.com/',
				codepen: 'https://codepen.io/'
			};
			$scope.data = {
				github: {},
				githubRepos: [],
				githubLanguages: {},
				codewars: {},
				codepen: {}
			};
			$scope.show = {
				codepen: {
					badge: false
				},
				apps: false,
				email_form: false
			};
			$scope.emailFormData = {
				name: '',
				email: '',
				header: '',
				message: '',
				domain: $location.$$host
			};
			$scope.emailPostBody = '';
			$scope.emailFormSuccessMessage = '';
			$scope.emailFormErrorMessage = '';
			$scope.resetFormResultMessage = function() {
				$scope.emailFormSuccessMessage = '';
				$scope.emailFormErrorMessage = '';
			};
			$scope.emailFormDataKeys = Object.keys($scope.emailFormData);
			$scope.emailFormPlaceholders = {
				name: 'Your name',
				email: 'your@email.tld',
				header: 'Your message header',
				message: 'Your message text'
			};
			$scope.toggleApps = function() {
				$scope.show.apps = ($scope.show.apps) ? false : true;
				console.log('toggleApps:', $scope.show.apps);
			};
			$scope.toggleEmailForm = function() {
				$scope.show.email_form = ($scope.show.email_form) ? false : true;
				console.log('toggleEmailForm:', $scope.show.email_form);
			};
			$scope.sendMessage = function(isFormValid) {
				$scope.loading = true;
				$scope.emailFormErrorMessage = '';
				$scope.emailFormSuccessMessage = '';
				if (isFormValid) {
					$scope.emailPostBody = '';
					for (var i = 0, max = $scope.emailFormDataKeys.length; i < max; i++) {
						var key = $scope.emailFormDataKeys[i];
						$scope.emailPostBody += key + '=' + $scope.emailFormData[key] + '&';
					}
					$scope.emailPostBody = $scope.emailPostBody.substring(0, $scope.emailPostBody.length - 1);
					SendEmailService.save({}, $scope.emailPostBody).$promise.then(
						function(response) {
							console.log('sendMessage response: ', response);
							if (response.success) {
								$scope.emailFormErrorMessage = '';
								$scope.emailFormSuccessMessage = 'Your message was successfully sent. You will get a reply to the provided email address shortly.';
								$timeout(function() {
									$scope.toggleEmailForm();
									for (var i = 0, max = $scope.emailFormDataKeys.length; i < max; i++) {
										var key = $scope.emailFormDataKeys[i];
										$scope.emailFormData[key] = (key !== 'domain') ? '' : $scope.emailFormData[key];
									}
								}, 3000);
							} else if (response.error) {
								$scope.emailFormErrorMessage = response.error;
								$scope.emailFormSuccessMessage = '';
							} else {
								$scope.emailFormErrorMessage = 'Unknown error';
								$scope.emailFormSuccessMessage = '';
							}
							$scope.loading = false;
						},
						function(error) {
							console.log('sendMessage error: ', error);
							$scope.emailFormSuccessMessage = '';
							$scope.emailFormErrorMessage = error.status + ' : ' + error.statusText;
							$scope.loading = false;
						}
					);
				} else {
					$scope.emailFormErrorMessage = 'The form fields\' values are not valid. Correct mistakes and resubmit your message, please.';
				}
			};

			$scope.getUserConfig = function() {
				$scope.loading = true;
				UserConfigService.query({}).$promise.then(
					function(response) {
						console.log('getUserConfig success: ', response);
						$scope.displayError = undefined;
						$scope.loading = false;
						$scope.userConfig = response;
						console.log('use config', $scope.userConfig);
						$scope.links.codewars += $scope.userConfig.username.codewars;
						$scope.links.hackerrank += $scope.userConfig.username.hackerrank;
						$scope.links.github += $scope.userConfig.username.github;
						$scope.links.codepen += $scope.userConfig.username.codepen;
						$scope.getGithubProfile();
						$scope.getCodepenProfile();
						$scope.getCodewarsProfile();
					},
					function(error) {
						console.log('getUserConfig error: ', error);
						$scope.displayError = error.status + ' : ' + error.statusText;
						$scope.loading = false;
					}
				);
			};

			$scope.getGithubProfile = function() {
				$scope.loading = true;
				GetGithubProfileService.query({ user: $scope.userConfig.username.github }).$promise.then(
					function(response) {
						console.log('getGithubProfile success: ', response);
						$scope.displayError = undefined;
						$scope.loading = false;
						$scope.data.github = response;
						$scope.getGithubRepos();
					},
					function(error) {
						console.log('getGithubProfile error: ', error);
						$scope.displayError = error.status + ' : ' + error.statusText;
						$scope.loading = false;
					}
				);
			};
			$scope.getGithubRepos = function() {
				$scope.loading = true;
				GetGithubUserReposService.query({ user: $scope.userConfig.username.github }).$promise.then(
					function(response) {
						console.log('getGithubRepos success: ', response);
						$scope.displayError = undefined;
						$scope.loading = false;
						$scope.data.githubRepos = response;
						for (var i = 0, max = $scope.data.githubRepos.length; i < max; i++) {
							$scope.getGithubRepoLanguages($scope.data.githubRepos[i].name);
						}
					},
					function(error) {
						console.log('getGithubRepos error: ', error);
						$scope.displayError = error.status + ' : ' + error.statusText;
						$scope.loading = false;
					}
				);
			};
			$scope.getGithubRepoLanguages = function(repoName) {
				$scope.loading = true;
				GetGithubRepoLanguagesService.query({ user: $scope.userConfig.username.github, repo: repoName }).$promise.then(
					function(response) {
						console.log('getGithubRepoLanguages success: ', response);
						$scope.displayError = undefined;
						$scope.loading = false;
						loop:
						for (var key in response) {
							if (key.indexOf('$') !== -1) {
								console.log('don\'t copy object properties other than languages');
								break loop;
							}
							console.log('key:', key);
							console.log('response[key]:', response[key]);
							if ($scope.data.githubLanguages.hasOwnProperty(key)) {
								$scope.data.githubLanguages[key] += response[key];
							} else {
								$scope.data.githubLanguages[key] = response[key];
							}
						}
					},
					function(error) {
						console.log('getGithubRepoLanguages error: ', error);
						$scope.displayError = error.status + ' : ' + error.statusText;
						$scope.loading = false;
					}
				);
			};
			$scope.getCodepenProfile = function() {
				$scope.loading = true;
				GetCodepenProfileService.query({ user: $scope.userConfig.username.codepen }).$promise.then(
					function(response) {
						console.log('getCodepenProfile success: ', response);
						$scope.displayError = undefined;
						$scope.loading = false;
						$scope.data.codepen = response.data;
					},
					function(error) {
						console.log('getCodepenProfile error: ', error);
						$scope.displayError = error.status + ' : ' + error.statusText;
						$scope.loading = false;
					}
				);
			};
			$scope.getCodewarsProfile = function() {
				$scope.loading = true;
				GetCodewarsProfileService.query({ user: $scope.userConfig.username.codewars }).$promise.then(
					function(response) {
						console.log('getCodewarsProfile success: ', response);
						$scope.displayError = undefined;
						$scope.loading = false;
						$scope.data.codewars = response;
					},
					function(error) {
						console.log('getCodewarsProfile error: ', error);
						$scope.displayError = error.status + ' : ' + error.statusText;
						$scope.loading = false;
						console.log('$scope.data:', $scope.data);
					}
				);
			};

			$scope.$on('$viewContentLoaded', function() {
				console.log('User Panel Controller content loaded');
				$scope.getUserConfig();
				console.log('>> WTF: ',$scope.emailFormData);
			});
			$scope.$on('$destroy', function() {
				console.log('User Panel Controller destroyed');
			});
		}
	]);
