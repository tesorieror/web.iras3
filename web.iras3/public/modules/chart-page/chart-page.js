chartPage
		.controller(
				'ChartPageCtrl',
				function($scope, $log, $location, $filter, chartCategorySrv, chartTagSrv, chartIndicatorSrv, chartSelectionSrv, chartBuilder, c) {
					$log.log('ChartPage controller loaded!')

					var selection = chartSelectionSrv.getSelection('2-15')
					chartCategorySrv.setSelection(selection)
					chartIndicatorSrv.setSelection(selection)
					chartTagSrv.setSelection(selection)

					var indicators = []
					var selectedTags = []
					var chartRows;
					$scope.visibleCategories = []
					$scope.categories = []

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
						selectedTags = tags
						return tags
					}

					function setCategories(cats) {
						$scope.categories = cats
						$scope.visibleCategories = _.select(cats, function(cat) {
							return cat.isVisible()
						})
						return cats
					}

					function setIndicators(inds) {
						$log.log('Indicators: ', inds);
						indicators = inds
						return inds
					}

					loadCategories()//
					.then(setCategories)//
					.then(loadSelectedTags)//
					.then(setSelectedTags)//
					.then(loadIndicators)//					
					.then(setIndicators)//
					.then(draw)

					/*********************************************************************
					 * Drawing
					 */
					function draw() {
						$scope.chartObject = buildChart()
						chartRows = $scope.chartObject.data.rows
					}

					/*********************************************************************
					 * Full Table Chart
					 */

					function buildChart() {

						function buildCols() {
							var cols = _
									.map(
											$scope.visibleCategories,
											function(cat) {
												return {
													"id" : cat._id,
													"label" : cat.description,
													"type" : "string",
													"p" : {
														"style" : "font-size: smaller; color:blue;white-space:nowrap;"
													}
												}
											})
							return cols.concat({
								"id" : "students",
								"label" : "Students",
								"type" : "number",
								"p" : {
									"style" : "color: red;"
								}
							})
						}

						function buildRows() {
							return _
									.map(
											indicators,
											function(indicator) {
												return {
													"c" : _
															.map(
																	indicator.tags,
																	function(tag) {
																		return {
																			"v" : tag.description,
																			"p" : {
																				"style" : "text-align:center; font-size: smaller;white-space:nowrap;"
																			}
																		}
																	})
															.concat(
																	{
																		"v" : indicator.value,
																		"p" : {
																			"style" : "text-align:center; font-size: smaller;white-space:nowrap;"
																		}
																	})
												}
											})
						}

						return {
							'type' : 'Table',
							'displayed' : false,
							'data' : {
								'cols' : buildCols(),
								'rows' : buildRows()
							},
							'options' : {
								'fill' : '20',
								'width' : '100%',
								'showRowNumber' : false,
								'page' : 'enable',
								'pageSize' : '20',
								'allowHtml' : true
							}
						// "formatters" : {
						// "arrow" : [ {
						// "columnNum" : 2,
						// "base" : 0
						// } ]
						// }
						}
					}

					/*********************************************************************
					 * Methods
					 */

					$scope.getSelectedTagsForCategory = function(cat) {
						return _.filter(selectedTags, function(tag) {
							return tag.category._id == cat._id
						})
					}

					/*********************************************************************
					 * Filter
					 */

					$scope.searchStringChanged = function() {
						filterSearch();
						// $log.log('search string changed!')
					}

					function filterSearch() {
						$scope.chartObject.data.rows = $filter('filter')(chartRows,
								$scope.searchString);
					}

					/*********************************************************************
					 * Navigation
					 */

					$scope.chartFilterButtonClicked = function() {
						$log.log('ChartFilterButton clicked!')
						$location.path('/pages/chart-filter')
					}

				})
