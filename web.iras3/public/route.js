/**
 * Route Controller
 */

app.controller('RouteCtrl', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
})

app
		.config(function($routeProvider, $locationProvider) {

			$routeProvider
					.when('/pages/main', {
						templateUrl : '/pages/main/main.html',
					// controller : 'MainCtrl'
					})
					.when('/pages/aboutUnit', {
						templateUrl : '/pages/about-unit/about-unit.html',
						controller : 'AboutUnitCtrl'
					})
					.when('/pages/chart', {
						templateUrl : '/modules/iras-chart/chart.html',
						controller : 'ChartCtrl'
					})
					.when('/pages/chart-filter', {
						// templateUrl : '/modules/iras-chart/iras-chart-filter-page.html',
						// controller : 'IrasChartFilterPageCtrl'

						templateUrl : '/modules/iras-chart/chart-filter.html',
						controller : 'ChartFilterCtrl'
					})
					// .when('/goalOfUnit', {
					// templateUrl : './goal-of-unit/goal-of-unit.html',
					// controller : 'GoalOfUnitCtrl'
					// })
					// .when(
					// '/students-academic-level',
					// {
					// templateUrl :
					// './students-academic-level/students-academic-level.html',
					// controller : 'StudentsAcademicLevelCtrl'
					// })
					// .when('/students-university', {
					// templateUrl : './students-university/students-university.html',
					// controller : 'StudentsUniversityCtrl'
					// })
					// .when('/students-community', {
					// templateUrl : './students-community/students-community.html',
					// controller : 'StudentsCommunityCtrl'
					// })
					// .when(
					// '/students-community-service',
					// {
					// templateUrl :
					// './students-community-service/students-community-service.html',
					// controller : 'StudentsCommunityServiceCtrl'
					// })
					// .when('/students-staff', {
					// templateUrl : './students-staff/students-staff.html',
					// controller : 'StudentsStaffCtrl'
					// })
					// .when(
					// '/students-freshmen-undergraduate',
					// {
					// templateUrl :
					// './students-freshmen-undergraduate/students-freshmen-undergraduate.html',
					// controller : 'StudentsFreshmenUndergraduateCtrl'
					// })
					// .when(
					// '/students-freshmen-intermediate',
					// {
					// templateUrl :
					// './students-freshmen-intermediate/students-freshmen-intermediate.html',
					// controller : 'StudentsFreshmenIntermediateCtrl'
					// })
					//
					// .when(
					// '/students-freshmen-post-graduate-college-section-specialization',
					// {
					// templateUrl :
					// './students-freshmen-post-graduate-college-section-specialization/students-freshmen-post-graduate-college-section-specialization.html',
					// controller :
					// 'StudentsFreshmenPostGraduateCollegeSectionSpecializationCtrl'
					// })
					//							
					// .when(
					// '/students-freshmen-intermediate-diploma-college-section-specialization',
					// {
					// templateUrl :
					// './students-freshmen-intermediate-diploma-college-section-specialization/students-freshmen-intermediate-diploma-college-section-specialization.html',
					// controller :
					// 'StudentsFreshmenIntermediateDiplomaCollegeSectionSpecializationCtrl'
					// })
					//							
					.when(
							'/pages/informationNotAvailable',
							{
								templateUrl : '/pages/information-not-available/information-not-available.html',
								controller : 'InformationNotAvailableCtrl'
							})//
					.otherwise({
						redirectTo : '/pages/main'
					});

			// configure html5 to get links working on jsfiddle
			// $locationProvider.html5Mode(true);
		});