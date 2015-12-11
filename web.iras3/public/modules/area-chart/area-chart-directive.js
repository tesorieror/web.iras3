/**
 * Line Chart Directive
 * 
 */

areaChart.directive('areaChart', function() {
	return {
		restrict : 'E',
		templateUrl : '/modules/area-chart/area-chart-directive.html',
		scope : {
			categories : '=',
			indicators : '=',
			selectedTags : '=',
			chartDescription : '@',
			chartFilterButtonClicked : '&filterClicked'
		},
		controller : 'AreaChartCtrl'
	};
});

areaChart.controller('AreaChartCtrl',
		function($scope, $log, $location, $filter, $rootScope, c) {
			$log.log('Area Chart controller loaded!')

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

			/*************************************************************************
			 * Drawing
			 */
			function draw() {
				$scope.chartObject = buildChart()
				chartRows = $scope.chartObject.data.rows
			}

			/*************************************************************************
			 * Bar Table Chart
			 */

			function buildChart() {

				var indicatorsByYear = {}

				var indicatorTags = {}

				_.each($scope.indicators, function(indicator) {
					var key = indicator.getKeyWoYr()
					var yrTag = indicator.getYrTag()
					if (!indicatorsByYear[yrTag._id])
						indicatorsByYear[yrTag._id] = {}
					indicatorsByYear[yrTag._id][key] = indicator

					_.each(indicator.tags, function(t) {
						if (!indicatorTags[t._id])
							indicatorTags[t._id] = 0;
						indicatorTags[t._id]++
					})
				})

				$log.log('indicatorTags', indicatorTags)

				var dataTags = _.reject($scope.selectedTags, function(tag) {
					return tag.category._id == 'YR'
				})

				var dataTagsWithIndicators = _.select(dataTags, function(tag) {
					return indicatorTags[tag._id]
				})

				$log.log('dataTagsWithIndicators', dataTagsWithIndicators)

				var dataTagsByCategory = _.groupBy(dataTagsWithIndicators,
						function(tag) {
							return tag.category._id;
						});

				$log.log('dataTagsWithIndicators', dataTagsByCategory)

				var differentialTags = _.select(_.values(dataTagsByCategory),
						function(tagArr) {
							return tagArr.length > 1
						})

				$log.log('differentialTags', differentialTags)

				function product(arr1, arr2) {
					if (arr1.length < 1)
						return _.map(arr2, function(elem) {
							return [ elem ]
						});
					else {
						var result = []
						_.each(arr2, function(elem) {
							_.each(arr1, function(arr) {
								var copy = arr.slice(0)
								copy.push(elem)
								result.push(copy)
							})
						})
						return result
					}
				}

				var tagDesc = _.reduce(differentialTags, function(acc, arr) {
					return product(acc, arr)
				}, [])

				$log.log('tagDesc', tagDesc)

				var descLabels = _.map(tagDesc, function(arr) {
					return _.map(arr, function(tag) {
						return tag.description
					}).join(' ')
				})

				if (descLabels.length == 0)
					descLabels = [ 'Students' ]

				$log.log(descLabels)

				var yearCol = [ {
					"id" : 'year_id',
					"label" : 'Year',
					"type" : "string",
					"p" : {}
				} ]

				var descCols = _.map(descLabels, function(desc) {
					return {
						"id" : desc + '_id',
						"label" : desc,
						"type" : "number",
						"p" : {}
					}
				})
				var cols = yearCol.concat(descCols)

				$log.log('indicatorsByYear', indicatorsByYear)

				var rows = []

				_.each(_.values(indicatorsByYear), function(indicatorsObj) {
					var indicators = _.values(indicatorsObj)
					var data = [ {
						"v" : indicators[0].getYrTag().description,
					} ]

					indicators = _.sortBy(indicators, function(indicator) {
						var indicatorTagIds = _.pluck(indicator.tags, '_id')
						var i = 0
						var ok = false
						while (!ok) {
							ok = _.all(tagDesc[i], function(tag) {
								return _.contains(indicatorTagIds, tag._id)
							})
							if (!ok)
								i++;
						}
						return i
					})

					_.each(indicators, function(indicator) {
						data.push({
							"v" : indicator.value,
						})
					})

					data.push(null)
					rows.push({
						'c' : data
					})
				})

				$log.log(rows)

				return {
					'type' : 'AreaChart',
					'displayed' : false,
					'data' : {
						'cols' : cols,
						'rows' : rows
					},
					'options' : {						
						"displayExactValues" : true,
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

			/*************************************************************************
			 * Methods
			 */

			$scope.getSelectedTagsForCategory = function(cat) {
				return _.filter($scope.selectedTags, function(tag) {
					return tag.category._id == cat._id
				})
			}

			/*************************************************************************
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
