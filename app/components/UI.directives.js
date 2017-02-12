'use strict';

var UIDirectives = angular.module('portfolio.UIDirectives', []);

UIDirectives.directive('imageOnLoad', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind('load', function() {
				console.log('image loaded');
				scope.show.codepen.badge = true;
			});
			element.bind('error', function() {
				console.log('image load error' + scope.data);
				scope.show.codepen.badge = false;
			});
		}
	};
});
