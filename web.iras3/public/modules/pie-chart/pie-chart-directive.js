/**
 * Pie Chart Directive
 * 
 */

pieChart.directive('pieChart', function() {
	return {
		restrict : 'E',
		templateUrl : '/modules/pie-chart/pie-chart-directive.html',
		scope : {
			categories : '=',
			indicators : '=',
			selectedTags : '=',
			chartDescription : '@',
			chartFilterButtonClicked : '&filterClicked'
		},
		controller : 'PieChartCtrl'
	};
});

pieChart.controller('PieChartCtrl',
		function($scope, $log, $location, $filter, $rootScope, c) {
			$log.log('Pie Chart controller loaded!')

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

				var yrTags = _.select($scope.selectedTags, function(tag) {
					return tag.category._id == 'YR'
				})

				$scope.oneYearOnly = yrTags.length<2
				
				var yrTag = _.first(yrTags)

				var dataTags = _.reject($scope.selectedTags, function(tag) {
					return tag.category._id == 'YR'
				})

				var indicatorTags = {}

				var indicatorsByYear = {}

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

				var dataTagsWithIndicators = _.select(dataTags, function(tag) {
					return indicatorTags[tag._id]
				})

				var dataTagsByCategory = _.groupBy(dataTagsWithIndicators,
						function(tag) {
							return tag.category._id;
						});

				var differentialTags = _.select(_.values(dataTagsByCategory),
						function(tagArr) {
							return tagArr.length > 1
						})

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

				var descLabels = _.map(tagDesc, function(arr) {
					return _.map(arr, function(tag) {
						return tag.description
					}).join(' ')
				})

				if (descLabels.length == 0)
					descLabels = [ 'Students' ]

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

				var validIndicators = _.select($scope.indicators, function(indicator) {
					var tagIds = _.pluck(indicator.tags, '_id')
					return _.contains(tagIds, yrTag._id)
				})

				var validIndicatorsSortedByDescLabels = _.sortBy(validIndicators,
						function(indicator) {
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

				var rows = []
				var i = 0
				_.each(validIndicatorsSortedByDescLabels, function(indicator) {
					rows.push({
						'c' : [ {
							"v" : descLabels[i],
						}, {
							"v" : parseInt(indicator.value),
						}, null ]
					})
					i++
				})

				$log.log('rows', rows)
				$log.log('cols', cols)

				return {
					'type' : 'PieChart',
					'displayed' : false,
					'data' : {
						'cols' : cols,
						'rows' : rows
					},
					'options' : {
						'title' : $scope.chartDescription,
						'is3D' : true,
						"displayExactValues" : true,
//						'width' : '100%',
//						'height' : '800px',
						'allowHtml' : true,
						'legend' : 'bottom',
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
