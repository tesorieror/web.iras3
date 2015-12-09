chart.factory('chartSelectionSrv', function($http, $q, $log, chartBuilder) {
	var factory = {}

	factory.selections = {}

	function Selection() {
		self.self = this;

		self.selectedChart = chartBuilder.TABLE_DESCRIPTION

		self.categoryIds = []
		self.selectedCategoryId = null
		self.visibleCategoryIds = []
		self.changeableCategoryIds = []
		self.expandedCategoryIds = []
		self.selectedTagIds = []
		self.expandedSelectedTagIds = []

		/***************************************************************************
		 * Charts
		 */

		self.selectDescriptionTable = function() {
			self.selectedChart = chartBuilder.TABLE_DESCRIPTION
		}

		self.selectFullTable = function() {
			self.selectedChart = chartBuilder.TABLE_FULL
		}

		self.selectSummaryTable = function() {
			self.selectedChart = chartBuilder.TABLE_SUMMARY
		}

		self.selectColumnChart = function() {
			self.selectedChart = chartBuilder.COLUMN
		}

		self.selectLineChart = function() {
			self.selectedChart = chartBuilder.LINE
		}

		self.selectAreaChart = function() {
			self.selectedChart = chartBuilder.AREA
		}

		self.selectPieChart = function() {
			self.selectedChart = chartBuilder.PIE
		}

		/***************************************************************************
		 * Categories
		 */

		self.setCategoryIds = function(catIds) {
			self.categoryIds = catIds
		}

		self.getCategoryIds = function() {
			return self.categoryIds
		}

		self.getVisibleCategoryIds = function() {
			return self.visibleCategoryIds
		}

		self.selectCategoryId = function(catId) {
			self.selectedCategoryId = catId
		}

		self.isCategoryIdSelected = function(catId) {
			return self.selectedCategoryId == catId
		}

		self.getSelectedCategoryId = function() {
			return self.selectedCategoryId
		}

		/***************************************************************************
		 * Category visibility
		 */

		self.showCategoryByIds = function(catIds) {
			_.each(catIds, function(catId) {
				self.showCategoryId(catId)
			})
		}

		self.showCategoryId = function(catId) {
			if (_.contains(self.visibleCategoryIds, catId))
				return;
			self.visibleCategoryIds.push(catId)
		}

		self.isCategoryIdVisible = function(catId) {
			return _.contains(self.visibleCategoryIds, catId)
		}

		self.hideCategoryId = function(catId) {
			var index = self.visibleCategoryIds.indexOf(catId)
			if (index >= 0)
				self.visibleCategoryIds.splice(index, 1)
		}

		self.toggleCategoryIdVisible = function(catId) {
			if (self.isCategoryIdVisible(catId))
				self.hideCategoryId(catId)
			else
				self.showCategoryId(catId)
		}

		self.showCategoryIds = function(catIds) {
			_.each(catIds, function(catId) {
				self.showCategoryId(catId)
			})
		}

		/***************************************************************************
		 * Category expansion
		 */

		self.expandCategoryId = function(catId) {
			if (_.contains(self.expandedCategoryIds, catId))
				return;
			self.expandedCategoryIds.push(catId)
		}

		self.isCategoryIdExpanded = function(catId) {
			return _.contains(self.expandedCategoryIds, catId)
		}

		self.isCategoryIdCollapsed = function(catId) {
			return !self.isCategoryIdExpanded(catId)
		}

		self.collapseCategoryId = function(catId) {
			var index = self.expandedCategoryIds.indexOf(catId)
			if (index >= 0)
				self.expandedCategoryIds.splice(index, 1)
		}

		self.toggleExpandCollapseCategoryId = function(catId) {
			if (self.isCategoryIdExpanded(catId))
				self.collapseCategoryId(catId);
			else
				self.expandCategoryId(catId);
		}

		/***************************************************************************
		 * Category changeable
		 */

		self.isCategoryIdChangeable = function(catId) {
			return _.contains(self.changeableCategoryIds, catId)
		}

		self.setChangeableCategoryIds = function(catIds) {
			self.changeableCategoryIds = catIds
		}

		/***************************************************************************
		 * Tags
		 */

		self.selectTagId = function(tagId) {
			if (_.contains(self.selectedTagIds, tagId))
				return true;
			self.selectedTagIds.push(tagId)
			return true
		}

		self.unselectTagId = function(tagId) {
			var index = self.selectedTagIds.indexOf(tagId)
			if (index >= 0)
				self.selectedTagIds.splice(index, 1);
			return false;
		}

		self.isTagIdSelected = function(tagId) {
			return _.contains(self.selectedTagIds, tagId)
		}

		self.toggleTagIdSelection = function(tagId) {
			if (self.isTagIdSelected(tagId))
				return self.unselectTagId(tagId);
			else
				return self.selectTagId(tagId);
		}

		self.selectTagsByIds = function(tagIds) {
			// $log.log('selectTagsByIds', tagIds)
			self.selectedTagIds = tagIds
		}

		self.getSelectedTagIds = function() {
			return self.selectedTagIds
		}

		/***************************************************************************
		 * Tag expansion
		 */

		self.expandSelectedTagId = function(tagId) {
			if (_.contains(self.expandedSelectedTagIds, tagId))
				return;
			self.expandedSelectedTagIds.push(tagId)
		}

		self.isSelectedTagIdExpanded = function(tagId) {
			return _.contains(self.expandedSelectedTagIds, tagId)
		}

		self.isSelectedTagIdCollapsed = function(tagId) {
			return !self.isSelectedTagIdExpanded(tagId)
		}

		self.collapseSelectedTagId = function(tagId) {
			var index = self.expandedSelectedTagIds.indexOf(tagId)
			if (index >= 0)
				self.expandedSelectedTagIds.splice(index, 1);
		}

		self.toggleExpandCollapseSelectedTagId = function(tagId) {
			if (self.isSelectedTagIdExpanded(tagId))
				self.collapseSelectedTagId(tagId);
			else
				self.expandSelectedTagId(tagId);
		}
	}

	/*****************************************************************************
	 * Factory functions
	 */

	factory.registerSelection = function(selectionId, selection) {
		factory.selections[selectionId] = selection
	}

	factory.unregisterSelection = function(selectionId) {
		if (factory.selections[selectionId])
			delete factory.selections[selectionId];
	}

	factory.getSelection = function(selectionId) {
		return factory.selections[selectionId]
	}

	/*****************************************************************************
	 * Registry
	 */

	function initRegistry() {

		// 2-15
		var selection = new Selection();
		var categoryIds = [ 'YR', 'SS', 'DS', 'GE', 'NA', 'SSYS', 'IT', 'IN', 'CO',
				'SE', 'SP' ]
		var tagIds = [ 'YR-2014', 'YR-2013', 'SS-FRE', 'DS-POSGRA', 'GE-MAL',
				'NA-SAU', 'SSYS-MAS', 'IT-PUBUNI', 'IN-KINABDUNI', 'CO-SCI', 'SE-PHY',
				'SP-PHY' ]
		var visibleCategoryIds = [ 'YR', 'GE', 'NA', 'SSYS', 'IN', 'CO',
				'SE', 'SP' ]
		var changeableCategoryIds = [ 'YR', 'GE', 'NA', 'SSYS', 'IT', 'IN', 'CO',
				'SE', 'SP' ]
		selection.setCategoryIds(categoryIds)
		selection.selectCategoryId(categoryIds[0])
		selection.selectTagsByIds(tagIds)
		selection.showCategoryIds(visibleCategoryIds)
		selection.setChangeableCategoryIds(changeableCategoryIds)
		factory.registerSelection('2-15', selection)

	}

	initRegistry()

	return factory
})