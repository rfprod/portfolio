'use strict';

angular.module('portfolio.userPanel', ['ngRoute', 'ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'views/user-panel/user-panel.html',
		controller: 'UserPanelController'
	});
}])

.controller('UserPanelController', ['$scope', '$timeout', 'usSpinnerService', 'UserConfigService', 'GetGithubProfileService', 'GetCodewarsProfileService', 'GetCodepenProfileService',
	function($scope, $timeout, usSpinnerService, UserConfigService, GetGithubProfileService, GetCodewarsProfileService, GetCodepenProfileService) {
		$scope.displayError = undefined;
		$scope.loading = false;
		$scope.$watch('loading',function(newValue){
			if (newValue) { usSpinnerService.spin('root-spinner'); }
			if (!newValue) { usSpinnerService.stop('root-spinner'); }
		});

		$scope.userConfig = {};
		$scope.links = {
			codewars: 'https://www.codewars.com/users/',
			github: 'https://github.com/',
			codepen: 'https://codepen.io/'
		};
		$scope.data = {
			github: {},
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
			email: '',
			text: '',
			successMessage: '',
			errorMessage: ''
		};
		$scope.emailFormDataKeys = Object.keys($scope.emailFormData);
		$scope.emailFormPlaceholders = {
			email: 'your@email.tld',
			text: 'Your message text'
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
			$scope.emailFormData.errorMessage = '';
			if (isFormValid) {
				/*
				*	TODO
				*	send message
				*/
				$scope.emailFormData.successMessage = 'Your message was successfully sent. You will get a reply to the provided email address shortly.';
				$timeout(function() {
					$scope.toggleEmailForm();
					for (var i = 0, max = $scope.emailFormDataKeys.length; i < max; i++) {
						$scope.emailFormData[$scope.emailFormDataKeys[i]] = '';
					}
				}, 3000);
			} else {
				$scope.emailFormData.errorMessage = 'The form fields\' values are not valid. Correct mistakes and resubmit your message, please.';
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
					$scope.links.github += $scope.userConfig.username.github;
					$scope.links.codepen += $scope.userConfig.username.codepen;
					$scope.getGithubProfile();
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
					$scope.getCodepenProfile();
				},
				function(error) {
					console.log('getGithubProfile error: ', error);
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
					$scope.getCodewarsProfile();
					console.log($scope.data);
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
		});
		$scope.$on('$destroy', function() {
			console.log('User Panel Controller destroyed');
		});
	}
]);
