/**
 * New node file
 */

irasChart
		.controller(
				'ChartCtrl',
				function($scope, $log, $location, $filter, irasDatabase, chartFilterSelection, chartBuilder) {
					$log.log('Chart Controller loaded!')

					$scope.activePath = $location.path();

					$scope.selection = chartFilterSelection

					$scope.chartBuilder = chartBuilder

					chartFilterSelection.load()//
					.then(init)//					

					/*********************************************************************
					 * Initialization
					 */
					function init() {
						// Visible categories
						// $log.log('VIS cart',$scope.selection.visibleCategories)
						drawChart();
					}

					var chartRows;

					function drawChart() {
						irasDatabase.getIndicatorsForTags($scope.selection.selectedTags)//
						.then(function(indicators) {
							var data = {
								tags : $scope.selection.selectedTags,
								categories : $scope.selection.categories,
								columns : $scope.selection.visibleCategories,
								indicators : indicators
							}
							$scope.chartObject = $scope.chartBuilder.build(data)
							$log.log('chartObject', $scope.chartObject)
							chartRows = $scope.chartObject.data.rows.slice(0)
							filterSearch();
						})
					}

					function filterSearch() {
						$scope.chartObject.data.rows = $filter('filter')(chartRows,
								$scope.searchString);
					}

					/*********************************************************************
					 * Filter description
					 */

					// function getFilterDescriptionForCategory(cat) {
					// var result = ''
					// for (tag in selection.getSelectedTagsForCategory(cat)) {
					// result = tag.description + ' '
					// for (dep in selection.getSelectedDependenciesForTag(tag)) {
					// for (depTag in dep.tags) {
					//
					// }
					// }
					//
					// }
					// }
					/*********************************************************************
					 * Events
					 */

					function chartBuilderChanged() {
						drawChart();
					}

					function showCategoryChanged() {
						drawChart();
					}

					function searchStringChanged() {
						filterSearch();
						$log.log('search string changed!')
					}

					$scope.chartBuilderChanged = chartBuilderChanged
					$scope.showCategoryChanged = showCategoryChanged
					$scope.searchStringChanged = searchStringChanged

					/*********************************************************************
					 * Navigation
					 */

					function filterModeClicked() {
						$location.path('/pages/chart-filter')
					}

					$scope.filterModeClicked = filterModeClicked

				});