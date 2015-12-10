/**
 * Full Chart Directive
 * 
 */

fullTableChart
		.directive(
				'fullTableChart',
				function() {
					return {
						restrict : 'E',
						templateUrl : '/modules/full-table-chart/full-table-chart-directive.html',
						scope : {
							categories : '=',
							indicators : '=',
							selectedTags : '=',
							chartDescription : '@',
							chartFilterButtonClicked : '&filterClicked'
						},
						controller : 'FullTableChartCtrl'
					};
				});

fullTableChart
		.controller(
				'FullTableChartCtrl',
				function($scope, $log, $location, $filter, $rootScope, c) {
					$log.log('Full Chart controller loaded!')

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
					 * Summary Table Chart
					 */

					function buildChart() {

						var dataCategories = $scope.visibleCategories.slice(1);

						var yrTags = _.sortBy(_.select($scope.selectedTags, function(tag) {
							return tag.category._id == 'YR'
						}), 'description')

						function buildCols() {
							var dataCols = _
									.map(
											dataCategories,
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
							var yrCols = _
									.map(
											yrTags,
											function(tag) {
												return {
													"id" : tag._id,
													"label" : tag.description,
													"type" : "number",
													"p" : {
														"style" : "font-size: smaller; color:blue;white-space:nowrap;"
													}
												}
											})
							return dataCols.concat(yrCols)
						}

						function buildRows() {
							var indicatorsByYear = {}
							var rows = []
							_.each($scope.indicators, function(indicator) {
								var key = indicator.getKeyWoYr()
								var yrTag = indicator.getYrTag()
								if (!indicatorsByYear[key])
									indicatorsByYear[key] = {}
								indicatorsByYear[key][yrTag._id] = indicator
							})
							_
									.each(
											_.values(indicatorsByYear),
											function(indicatorByYear) {

												var i = 0
												var indicator = indicatorByYear[yrTags[i]._id]
												// $log.log(indicator)
												while (!indicator) {
													i++
													indicator = indicatorByYear[yrTags[i]._id]
													$log.log(indicator)
												}

												var tags = indicator.tags.slice(1)
												var data = _.map(tags, function(tag) {
													return {
														"v" : tag.description,
														"p" : {
															"style" : "text-align:center; "
																	+ "font-size: smaller;"
																	+ "white-space:nowrap;"
														}
													}
												})

												_
														.each(
																yrTags,
																function(yrTag) {
																	var value = indicatorByYear[yrTag._id] ? indicatorByYear[yrTag._id].value
																			: -1
																	data.push({
																		"v" : value,
																		"p" : {
																			"style" : "text-align:center; "
																					+ "font-size: smaller;"
																					+ "white-space:nowrap;"
																		}
																	})
																})

												rows.push({
													'c' : data
												})

											})
							return rows
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
