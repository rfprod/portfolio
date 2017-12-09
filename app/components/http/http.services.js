'use strict';

var httpServices = angular.module('portfolio.httpServices', ['ngResource']);

var baseUrl = {
	portfolio: '',
	github: 'https://api.github.com/',
	codewars: 'https://www.codewars.com/api/v1/',
	codepen: 'https://cpv2api.com/'
};

/*
*	dynamically set backend base url for backend requests
*/
function setBaseUrl(absUrl) {
	//console.log('absUrl:', absUrl);
	//console.log(' >> set base URL. match', absUrl.match(new RegExp('http(s)?:\/\/[^/]+'), 'ig'));
	return absUrl.match(new RegExp('http(s)?://[^/]+'))[0];
}

httpServices.factory('UserConfigService', ['$resource', '$location', function($resource, $location) {
	baseUrl.portfolio = setBaseUrl($location.$$absUrl);
	return $resource(baseUrl.portfolio + '/data/config.json', {}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

httpServices.factory('SendEmailService', ['$resource', '$location', function($resource, $location) {
	baseUrl.portfolio = setBaseUrl($location.$$absUrl);
	// return $resource(baseUrl.portfolio + '/php/contact.php', {}, { // TODO: remove this line as well as php script after migration to firebase is complete
	// return $resource('https://us-central1-rfprod-2cda1.cloudfunctions.net/sendEmail', {}, {
	return $resource( baseUrl.portfolio + '/sendEmail', {}, {
		save: {method: 'POST', isArray: false, headers: {'Content-type': 'application/x-www-form-urlencoded'},
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

httpServices.factory('GetGithubProfileService', ['$resource', function($resource) {
	return $resource(baseUrl.github + 'users/:user', {user: '@user'}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

httpServices.factory('GetGithubUserReposService', ['$resource', function($resource) {
	return $resource(baseUrl.github + 'users/:user/repos', {user: '@user'}, {
		query: {method: 'GET', params: {}, isArray: true,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

httpServices.factory('GetGithubRepoLanguagesService', ['$resource', function($resource) {
	return $resource(baseUrl.github + 'repos/:user/:repo/languages', {user: '@user', repo: '@repo'}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

httpServices.factory('GetCodepenProfileService', ['$resource', function($resource) {
	return $resource(baseUrl.codepen + 'profile/:user', {user: '@user'}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

httpServices.factory('GetCodewarsProfileService', ['$resource', function($resource) {
	return $resource(baseUrl.codewars + 'users/:user', {user: '@user'}, {
		query: {method: 'GET', params: {}, isArray: false,
			interceptor: {
				response: function(response) {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);
