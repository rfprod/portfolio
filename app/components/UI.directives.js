'use strict';

const UIDirectives = angular.module('portfolio.UIDirectives', []);

UIDirectives.directive('imageOnLoad', function() {
	return {
		restrict: 'A',
		link: (scope, element) => {
			element.bind('load', () => {
				console.log('image loaded');
				scope.show.codepen.badge = true;
			});
			element.bind('error', () => {
				console.log('image load error' + scope.data);
				scope.show.codepen.badge = false;
			});
		}
	};
});
