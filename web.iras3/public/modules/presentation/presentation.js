/**
 * http://usejsdoc.org/
 */

var presentation = angular.module('presentation', []);

presentation.directive('presentation', function($log, database) {

	return {
		restrict : 'E',
		templateUrl : '/modules/presentation/presentation.html',
		scope : {
			slides : '='
		},
		controller : 'PresentationCtrl'
	};
});

presentation.controller('PresentationCtrl', function($scope, $log) {
	$log.log("PresentationCtrl loaded!")

	$scope.myInterval = 5000;
	$scope.noWrapSlides = false;
//	$scope.slides = []
	$scope.slide = {
		title : '',
		subtitle : '',
		info : ''
	}
	
	$scope.slideClicked = function(index) {
		$log.log($scope.slides.length)
		$scope.slide = $scope.slides[index]
	}

	$scope.$watchCollection('slides', function(newValue, oldValue) {
		$log.log('slides')		
		$scope.slideClicked(0)
		$log.log(newValue.length)
	})

})