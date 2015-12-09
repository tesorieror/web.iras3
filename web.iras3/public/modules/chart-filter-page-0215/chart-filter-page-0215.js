/**
 * ChartFilter
 */

chartFilterPage0215
		.controller(
				'ChartFilterPage0215Ctrl',
				function($scope, $log, $location, chartCategorySrv, chartTagSrv, chartSelectionSrv) {
					$log.log('ChartFilterPage0215 controller loaded!')

					var selection = chartSelectionSrv.getSelection('2-15')

					$scope.categories = []
					$scope.selectedCategory = null
					$scope.tags = []
					$scope.selectedTags = []

					function initialize() {
						chartCategorySrv.setSelection(selection)
						chartTagSrv.setSelection(selection)

						loadCategories()//
						.then(setCategories)//
						.then(loadSelectedTags)//
						.then(setSelectedTags)//
					}

					function setCategories(categories) {
						$scope.categories = categories
					}

					function loadCategories() {
						return chartCategorySrv.loadCategories()
					}

					function loadSelectedTags() {
						return chartTagSrv.loadSelectedTagsWithDependencies()//
					}

					function setSelectedTags(selectedTags) {
						$scope.selectedTags = selectedTags
					}

					function loadTagsForCategory(cat) {
						return chartTagSrv.loadTagsWithDependenciesForCategory(cat)
					}

					function setTags(tags) {
						$scope.tags = tags
					}

					/*********************************************************************
					 * Events
					 */

					$scope.categorySelected = function(cat) {
						return loadTagsForCategory(cat)//
						.then(setTags)//
						.then(loadSelectedTags)//
						.then(setSelectedTags)//
					}

					$scope.descriptionTableButtonClicked = function() {
						selection.selectDescriptionTable()
						$location.path('/pages/full-table-chart-page-0215')
					}

					$scope.fullTableButtonClicked = function() {

						$location.path('/pages/full-table-chart-page-0215')
					}

					$scope.summaryTableButtonClicked = function() {

						$location.path('/pages/chart')
					}

					$scope.lineChartButtonClicked = function() {

						$location.path('/pages/chart')
					}

					$scope.columnChartButtonClicked = function() {

						$location.path('/pages/chart')
					}

					$scope.areaChartButtonClicked = function() {

						$location.path('/pages/chart')
					}

					$scope.pieChartButtonClicked = function() {

						$location.path('/pages/chart')
					}

					/*********************************************************************
					 * Initialize
					 */
					initialize()

				})