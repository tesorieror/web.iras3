var pageHeader = angular.module('pageHeader', []);

/**
 * Icon Tile Directive
 */

pageHeader.directive('pageHeader', function() {
	return {
		restrict : 'E',
		templateUrl : '/directives/page-header/page-header.html',
		scope : {
			title : '@',
			subtitle : '@'
		},
		controller : 'PageHeaderCtrl'
	};
});

pageHeader.controller('PageHeaderCtrl', function($scope, $log) {
	$log.log('PageHeaderCtrl loaded!')
});