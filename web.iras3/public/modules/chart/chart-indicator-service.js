chart.factory('chartIndicatorSrv', function($http, $q, $log, database) {
	var factory = {};

	var selection = null

	factory.setSelection = function(sel) {
		selection = sel
	}

	factory.loadIndicators = function() {
		return database.getIndicatorsForTags(selection.selectedTagIds)//		
		.then(filterAndSortIndicatorTagsByCategory)
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

	return factory
	
})