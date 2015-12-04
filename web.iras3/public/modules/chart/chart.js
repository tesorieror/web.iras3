/**
 * New node file
 */

irasChart
		.controller(
				'ChartCtrl',
				function($scope, $log, $location, $filter, irasDatabase, categoryTagSelectionSrv, chartBuilder, categorySrv, tagSrv) {
					$log.log('Chart Controller loaded!')

					$scope.activePath = $location.path();

					var selection = categoryTagSelectionSrv.getSelection('2-15')
					categorySrv.setSelection(selection)
					tagSrv.setSelection(selection)

					$scope.categories;
					$scope.selectedTags;
					var indicators

					/*********************************************************************
					 * Initialization
					 */

					function loadCategories() {
						return categorySrv.loadCategories().then(function(cats) {
							$scope.categories = cats
						})
					}

					function loadSelectedTags() {
						return tagSrv.loadSelectedTagsWithDependencies().then(
								function(tags) {
									$scope.selectedTags = tags
								})
					}

					function loadIndicators() {
						return irasDatabase.getIndicatorsForTags(selection.selectedTagIds)
								.then(function(inds) {
									indicators = inds
								})
					}

					loadCategories()//
					.then(loadSelectedTags)//
					.then(loadIndicators)//
					.then(function() {
						// $log.log('selectedTags', selectedTags)
						// $log.log('categories', categories)
						// $log.log('indicators', indicators)
					})//
					.then(drawChart);

					/*********************************************************************
					 * Draw Chart
					 */

					var chartRows;

					function drawChart() {
						var data = {
							tags : $scope.selectedTags,
							categories : $scope.categories,
							// columns : selection.visibleCategoryIds,
							indicators : indicators
						}
						$scope.chartObject = chartBuilder.build(data)
						$log.log('chartObject', $scope.chartObject)
						chartRows = $scope.chartObject.data.rows.slice(0)
						filterSearch();
					}

					function filterSearch() {
						$scope.chartObject.data.rows = $filter('filter')(chartRows,
								$scope.searchString);
					}
					/*********************************************************************
					 * Methods
					 */

					$scope.getSelectedTagsForCategory = function(cat) {
						return _.filter($scope.selectedTags, function(tag) {
							return tag.category._id == cat._id
						})
					}

					$scope.getSelectedDependenciesForTag = function(tag) {
						return _.filter(tag.dependencies, function(dep) {
							return _.all(dep.tags, function(depTag) {
								return _.contains(selection.selectedTagIds, depTag._id)
							})
						})
					}

					/*********************************************************************
					 * Events
					 */

					function searchStringChanged() {
						filterSearch();
						$log.log('search string changed!')
					}

					$scope.searchStringChanged = searchStringChanged

					/*********************************************************************
					 * Navigation
					 */

					$scope.chartFilterButtonClicked = function() {
						$log.log('ChartFilterButton clicked!')
						$location.path('/pages/chart-filter')
					}
				});