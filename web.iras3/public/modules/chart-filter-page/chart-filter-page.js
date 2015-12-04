/**
 * ChartFilter
 */

chartFilterPage
		.controller(
				'ChartFilterPageCtrl',
				function($scope, $log, $location, chartCategorySrv, chartTagSrv, chartSelectionSrv) {
					$log.log('ChartFilterPage controller loaded!')

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
						$location.path('/pages/chart')
					}

					$scope.fullTableButtonClicked = function() {
						selection.selectFullTable()
						$location.path('/pages/chart')
					}

					$scope.summaryTableButtonClicked = function() {
						selection.selectSummaryTable()
						$location.path('/pages/chart')
					}

					$scope.lineChartButtonClicked = function() {
						selection.selectLineChart()
						$location.path('/pages/chart')
					}

					$scope.columnChartButtonClicked = function() {
						selection.selectColumnChart()
						$location.path('/pages/chart')
					}

					$scope.areaChartButtonClicked = function() {
						selection.selectAreaChart()
						$location.path('/pages/chart')
					}

					$scope.pieChartButtonClicked = function() {
						selection.selectPieChart()
						$location.path('/pages/chart')
					}

					/*********************************************************************
					 * Initialize
					 */
					initialize()

				})