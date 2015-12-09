chart.factory('chartCategorySrv', function($http, $q, $log, database) {
	var factory = {};

	var selection = null;

	factory.setSelection = function(sel) {
		selection = sel
	}

	function loadForCategoryIds(catIds) {
		return database.getCategoriesByIds(catIds)//
		.then(sortByCategoryIds)//
		.then(decorateCategories)
	}

	factory.loadCategories = function() {
		return loadForCategoryIds(selection.getCategoryIds())
	}

	factory.loadVisibleCategories = function(){
		return loadForCategoryIds(selection.getVisibleCategoryIds())
	}	
	
	function sortByCategoryIds(categories) {
		var catIds = selection.getCategoryIds()
		return _.sortBy(categories, function(cat) {
			return catIds.indexOf(cat._id)
		})
	}

	function decorateCategories(categories) {
		function decorateCategory(cat) {
			// Vars
			cat.selection = selection

			// Methods
			// Selection
			cat.select = function() {
				return cat.selection.selectCategoryId(cat._id)
			}
			cat.isSelected = function() {
				return cat.selection.isCategoryIdSelected(cat._id)
			}

			// Expansion
			cat.collapse = function() {
				return cat.selection.collapseCategoryId(cat._id)
			}
			cat.expand = function() {
				return cat.selection.expandCategoryId(cat._id)
			}
			cat.isCollapsed = function() {
				return cat.selection.isCategoryIdCollapsed(cat._id)
			}
			cat.isExpanded = function() {
				return cat.selection.isCategoryIdExpanded(cat._id)
			}
			cat.toggleExpandCollapse = function() {
				return cat.selection.toggleExpandCollapseCategoryId(cat._id)
			}
			// Visibility
			cat.show = function() {
				return cat.selection.showCategoryId(cat._id)
			}
			cat.hide = function() {
				return cat.selection.hideCategoryId(cat._id)
			}
			cat.isVisible = function() {
				return cat.selection.isCategoryIdVisible(cat._id)
			}
			cat.toggleVisibility = function() {
				return cat.selection.toggleCategoryIdVisible(cat._id)
			}

			cat.isChangeable = function(){
				return cat.selection.isCategoryIdChangeable(cat._id)
			}
			
			return cat;
		}
		return _.map(categories, decorateCategory)
	}

	return factory;
})
