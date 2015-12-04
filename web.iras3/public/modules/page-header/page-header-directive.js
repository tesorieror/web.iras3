/**
 * Page Header Directive
 */

pageHeader.directive('pageHeader', function() {
	return {
		restrict : 'E',
		templateUrl : '/modules/page-header/page-header-directive.html',
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