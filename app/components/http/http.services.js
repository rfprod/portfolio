'use strict';

var httpServices = angular.module('portfolio.httpServices', ['ngResource']);

var baseUrl = {
	portfolio: '',
	github: 'https://api.github.com/',
	codewars: 'https://www.codewars.com/api/v1/',
	codepen: 'http://cpv2api.com/'
};

/*
*	dynamically set base url
*/
function setBaseUrl(host,absUrl){
	var root = absUrl.substring(0,absUrl.indexOf('#')-1);
	if (host == 'localhost') return 'http://localhost:7070'; // development
	else return root; // deployment
}

httpServices.factory('UserConfigService', ['$resource', '$location', function($resource, $location) {
	baseUrl.portfolio = setBaseUrl($location.$$host, $location.$$absUrl);
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
