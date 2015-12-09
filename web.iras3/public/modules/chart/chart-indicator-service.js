chart.factory('chartIndicatorSrv', function($http, $q, $log, database) {
	var factory = {};

	var selection = null

	factory.setSelection = function(sel) {
		selection = sel
	}

	factory.loadIndicators = function() {
		return database.getIndicatorsForTags(selection.selectedTagIds)//		
		.then(filterAndSortIndicatorTagsByCategory).then(decorateIndicators)
	}

	function filterAndSortIndicatorTagsByCategory(indicators) {
		_.each(indicators, function(indicator) {
			indicator.tags = _.filter(indicator.tags, function(tag) {
				return _.contains(selection.visibleCategoryIds, tag.category)
			})
			indicator.tags = _.sortBy(indicator.tags, function(tag) {
				return selection.categoryIds.indexOf(tag.category);
			})
		})
		return indicators
	}

	function decorateIndicators(indicators) {
		function decorateIndicator(indicator) {

			indicator.getYrTag = function() {
				return indicator.tags[0]
			}

			indicator.getKeyWoYr = function() {
				return _.pluck(indicator.tags.slice(1), '_id').join('_')
			}
			return indicator
		}

		return _.map(indicators, function(indicator) {
			return decorateIndicator(indicator)
		})
	}

	return factory

})