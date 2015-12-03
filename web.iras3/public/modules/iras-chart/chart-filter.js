/**
 * ChartFilter
 */

irasChart
		.controller(
				'ChartFilterCtrl',
				function($scope, $log, $location, c, categorySrv, tagSrv, chartFilterSelection, chartBuilder) {
					$log.log('ChartFilter controller loaded!')

					var selection = chartFilterSelection.getSelection('2-15')

					$scope.builder = chartBuilder

					$scope.categories = []
					$scope.selectedCategory = null
					$scope.tags = []
					$scope.selectedTags = []

					function initialize() {
						categorySrv.setSelection(selection)
						tagSrv.setSelection(selection)

						categorySrv.loadCategories()//
						.then(setCategories)//
						.then(updateSelectedTags)//
						.then(c.log('loadCategoriesByIds OK!'),
								c.error('loadCategoriesByIds'))
					}

					/*********************************************************************
					 * Load
					 */

					function setCategories(categories) {
						$scope.categories = categories
						updateSelectedCategory()
					}

					function updateSelectedCategory() {
						setSelectedCategory(_.detect($scope.categories, function(cat) {
							return cat.isSelected()
						}))
					}

					function setSelectedCategory(category) {
						$scope.selectedCategory = category
						category.select()
						updateTags()
					}

					function updateTags() {
						tagSrv.loadTagsWithDependenciesForCategory($scope.selectedCategory)//
						.then(setTags)
					}

					function setTags(tags) {
						$scope.tags = _.filter(tags, function(tag) {
							return tag.isAvailable()
						})

					}

					function updateSelectedTags() {
						function filterSelectedTags(tags) {
							return _.select(tags, function(tag) {
								return tag.isSelected()
							})
						}
						return tagSrv.loadSelectedTagsWithDependencies()//
						.then(filterSelectedTags)//
						.then(setSelectedTags)
					}

					function setSelectedTags(selectedTags) {
						$scope.selectedTags = selectedTags
					}

					/*********************************************************************
					 * Methods
					 */

					$scope.getSelectedTagsForCategory = function(cat) {
						return _.select($scope.selectedTags, function(selTag) {
							return selTag.category._id == cat._id
						})
					}

					function toggleTagSelection(tag) {
						// var selectedTags = [];
						function updateSelection() {
							var unavailableTags = _.reject($scope.selectedTags,
									function(selTag) {
										return selTag.isAvailable()
									})

							_.each(unavailableTags, function(unTag) {
								unTag.unselect()
							});
							updateSelectedTags()//
							.then(function() {
								if (unavailableTags.length > 0)
									updateSelection();
							})
						}

						tag.toggleSelection()
						updateSelectedTags().then(updateSelection)
					}

					/*********************************************************************
					 * Events
					 */

					$scope.categoryClicked = function(cat) {
						setSelectedCategory(cat)
					}

					$scope.categoryExpandCollapseIconClicked = function(cat) {
						cat.toggleExpandCollapse()
					}

					$scope.categoryVisibleIconClicked = function(cat) {
						cat.toggleVisibility()
					}

					$scope.selectedTagExpandCollapseIconClicked = function(tag) {
						tag.toggleExpandCollapse()
					}

					$scope.tagSelectedIconClicked = function(tag) {
						toggleTagSelection(tag)
					}

					/*********************************************************************
					 * Navigation
					 */

					$scope.chartModeClicked = function() {
						$location.path('/pages/chart')
					}

					/*********************************************************************
					 * Initialize
					 */
					initialize()

				})