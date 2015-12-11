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
					.when(
							'/pages/chart-filter-page-0215',
							{
								templateUrl : '/modules/chart-filter-page-0215/chart-filter-page-0215.html',
								controller : 'ChartFilterPage0215Ctrl'
							})
					.when(
							'/pages/full-table-chart-page-0215',
							{
								templateUrl : '/modules/full-table-chart-page-0215/full-table-chart-page-0215.html',
								controller : 'FullTableChartPage0215Ctrl'
							})
					.when(
							'/pages/plain-full-table-chart-page-0215',
							{
								templateUrl : '/modules/plain-full-table-chart-page-0215/plain-full-table-chart-page-0215.html',
								controller : 'PlainFullTableChartPage0215Ctrl'
							})
					.when(
							'/pages/summary-table-chart-page-0215',
							{
								templateUrl : '/modules/summary-table-chart-page-0215/summary-table-chart-page-0215.html',
								controller : 'SummaryTableChartPage0215Ctrl'
							})
					.when(
							'/pages/description-table-chart-page-0215',
							{
								templateUrl : '/modules/description-table-chart-page-0215/description-table-chart-page-0215.html',
								controller : 'DescriptionTableChartPage0215Ctrl'
							})
					.when(
							'/pages/column-chart-page-0215',
							{
								templateUrl : '/modules/column-chart-page-0215/column-chart-page-0215.html',
								controller : 'ColumnChartPage0215Ctrl'
							})
					.when(
							'/pages/bar-chart-page-0215',
							{
								templateUrl : '/modules/bar-chart-page-0215/bar-chart-page-0215.html',
								controller : 'BarChartPage0215Ctrl'
							})
					.when(
							'/pages/line-chart-page-0215',
							{
								templateUrl : '/modules/line-chart-page-0215/line-chart-page-0215.html',
								controller : 'LineChartPage0215Ctrl'
							})
					.when(
							'/pages/area-chart-page-0215',
							{
								templateUrl : '/modules/area-chart-page-0215/area-chart-page-0215.html',
								controller : 'AreaChartPage0215Ctrl'
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