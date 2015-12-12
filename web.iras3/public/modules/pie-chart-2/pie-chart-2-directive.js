/**
 * Pie Chart 2 Directive
 * 
 */

pieChart2.directive('pieChart2', function() {
	return {
		restrict : 'E',
		templateUrl : '/modules/pie-chart-2/pie-chart-2-directive.html',
		scope : {
			categories : '=',
			indicators : '=',
			selectedTags : '=',
			chartDescription : '@',
			chartFilterButtonClicked : '&filterClicked'
		},
		controller : 'PieChart2Ctrl'
	};
});

pieChart2
		.controller(
				'PieChart2Ctrl',
				function($scope, $log, $location, $filter, $rootScope, c) {
					$log.log('Pie Chart 2 controller loaded!')

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

						var yrTags = _.sortBy(_.select($scope.selectedTags, function(tag) {
							return tag.category._id == 'YR'
						}), 'description')

						function buildCols() {
							var descCols = [ {
								"id" : 'description_id',
								"label" : 'Description',
								"type" : "string",
								"p" : {
									"style" : "font-size: smaller; " + "color:blue;"
											+ "white-space:nowrap;"
								}
							} ]

							var yrCols = _.map(yrTags, function(tag) {
								return {
									"id" : tag._id,
									"label" : tag.description,
									"type" : "number",
									"p" : {
										"style" : "font-size: smaller;" + "color:blue;"
												+ "white-space:nowrap;"
									}
								}
							})
							return descCols.concat(yrCols)
						}

						function buildRows() {

							function getIndicatorsByYear(indicators) {
								var indicatorsByYear = {}
								_.each(indicators, function(indicator) {
									var key = indicator.getKeyWoYr()
									var yrTag = indicator.getYrTag()
									if (!indicatorsByYear[key])
										indicatorsByYear[key] = {}
									indicatorsByYear[key][yrTag._id] = indicator
								})
								return indicatorsByYear
							}

							function getIndicatorTags(indicatorByYear) {
								var i = 0
								var indicator = indicatorByYear[yrTags[i]._id]
								// $log.log(indicator)
								while (!indicator) {
									i++
									indicator = indicatorByYear[yrTags[i]._id]
								}
								return indicator.tags
							}

							var indicatorsByYear = getIndicatorsByYear($scope.indicators)
							var rows = []
							var dataCategories = $scope.visibleCategories.slice(1);
							var differentialCategories = _.filter(dataCategories,
									function(cat) {
										return _.filter($scope.selectedTags, function(tag) {
											return cat._id == tag.category
										}).length > 1
									})
							if (differentialCategories.length < 1)
								differentialCategories = dataCategories

							_
									.each(
											_.values(indicatorsByYear),
											function(indicatorByYear) {
												var tags = getIndicatorTags(indicatorByYear).slice(1)
												var differentialTags = _.filter(tags, function(tag) {
													return _.any(differentialCategories, function(cat) {
														return tag.category == cat._id
													})
												})

												$log.log('differentialTags', differentialTags)

												var description = _.reject(
														_.pluck(differentialTags, 'description'),
														function(desc) {
															return (s.startsWith(desc, 'Any') || s
																	.startsWith(desc, 'Total'))
														}).join(' ')

												var data = [ {
													"v" : description,
													"p" : {}
												} ]

												_
														.each(
																yrTags,
																function(yrTag) {
																	var value = indicatorByYear[yrTag._id] ? indicatorByYear[yrTag._id].value
																			: -1
																	data.push({
																		"v" : value,
																		"p" : {
																			"style" : "text-align:center;"
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
							'type' : 'PieChart',
							'displayed' : false,
							'data' : {
								'cols' : buildCols(),
								'rows' : buildRows()
							},
							'options' : {
								'is3D':true,
								'width' : '100%',
								'height' : '500px',
								'allowHtml' : true,
								'legend' : 'bottom',
								"vAxis" : {
									"title" : "Students",
									"gridlines" : {
										"count" : 10
									}
								}
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
