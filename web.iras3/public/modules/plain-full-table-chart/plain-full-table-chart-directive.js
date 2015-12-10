/**
 * Full Chart Directive
 * 
 */

plainFullTableChart.directive('plainFullTableChart', function() {
	return {
		restrict : 'E',
		templateUrl : '/modules/plain-full-table-chart/plain-full-table-chart-directive.html',
		scope : {
			categories : '=',
			indicators : '=',
			selectedTags : '=',
			chartDescription : '@',
			chartFilterButtonClicked : '&filterClicked'
		},
		controller : 'PlainFullTableChartCtrl'
	};
});

plainFullTableChart
		.controller(
				'PlainFullTableChartCtrl',
				function($scope, $log, $location, $filter, $rootScope, c) {
					$log.log('Plain Full Chart controller loaded!')

					var chartRows;
					$scope.visibleCategories = [];

					$scope.$watch('categories', function(newValue, oldValue) {						
						$scope.visibleCategories = _.select(newValue, function(cat) {
							return cat.isVisible()
						})
						update()
					})

					$scope.$watch('indicators', function(newValue, oldVal) {						
						update()
					})

					$scope.$watch('selectedTags', function(newValue, oldVal) {						
						update()
					})

					function update() {
						if ($scope.visibleCategories && $scope.indicators
								&& $scope.selectedTags) {
							draw();
						}
					}

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
											$scope.indicators,
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
						return _.filter($scope.selectedTags, function(tag) {
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

				})
