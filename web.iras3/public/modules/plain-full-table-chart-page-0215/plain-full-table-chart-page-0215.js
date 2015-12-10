plainFullTableChartPage0215
		.controller(
				'PlainFullTableChartPage0215Ctrl',
				function($scope, $log, $location, $filter, chartCategorySrv, chartTagSrv, chartIndicatorSrv, chartSelectionSrv, c) {
					$log.log('PlainFullTableChartPage0215 controller loaded!')

					$scope.subtitle = 'Plain Full Table Chart'
					var chartDescriptionPrefix = 'New students in post-graduate education, according to the college section and specialization for the academic years '

					var selection = chartSelectionSrv.getSelection('2-15')
					chartCategorySrv.setSelection(selection)
					chartIndicatorSrv.setSelection(selection)
					chartTagSrv.setSelection(selection)

//					$scope.indicators = [];
//					$scope.selectedTags = [];
//					$scope.categories = [];

					/*********************************************************************
					 * Initialization
					 */

					function loadIndicators() {
						return chartIndicatorSrv.loadIndicators()
					}

					function loadCategories() {
						// return chartCategorySrv.loadVisibleCategories()
						return chartCategorySrv.loadCategories()
					}

					function loadSelectedTags() {
						return chartTagSrv.loadSelectedTagsWithDependencies()
					}

					function setSelectedTags(tags) {
						$scope.selectedTags = tags
						return tags
					}

					function setCategories(cats) {
						$log.log('cats', $scope.categories)
						$scope.categories = cats
						$log.log('cats', $scope.categories)
					}

					function setIndicators(inds) {
						$scope.indicators = inds
						return inds
					}

					function setChartDescription() {
						var years = _.pluck(_.select($scope.selectedTags, function(tag) {
							return tag.category._id == 'YR'
						}), 'description').join(', ')
						$scope.chartDescription = chartDescriptionPrefix + years
					}

					loadCategories()//
					.then(setCategories)//
					.then(loadSelectedTags)//
					.then(setSelectedTags)//
					.then(loadIndicators)//					
					.then(setIndicators)//
					.then(setChartDescription)//		

					/*********************************************************************
					 * Navigation
					 */

					$scope.chartFilterButtonClicked = function() {
						$log.log('ChartFilterButton clicked!')
						$location.path('/pages/chart-filter-page-0215')
					}

				})
