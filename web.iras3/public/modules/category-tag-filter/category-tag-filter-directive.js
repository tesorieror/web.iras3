/**
 * Category Tag Filter Directive
 * 
 */

categoryTagFilter
		.directive(
				'categoryTagFilter',
				function() {
					return {
						restrict : 'E',
						templateUrl : '/modules/category-tag-filter/category-tag-filter-directive.html',
						scope : {
							categories : '=',
							tags : '=',
							selectedCategory : '=',
							selectedTags : '=',
							categorySelected : '&onCategorySelected',
							tagSelected : '&onTagSelected'
						},
						controller : 'CategoryTagFilterCtrl'
					};
				});

categoryTagFilter.controller('CategoryTagFilterCtrl', function($scope, $log) {
	$log.log('CategoryTagFilterCtrl loaded!')

	// Cache
	
	$scope.selectedTagsByCategory = {}
	
	// End of Cache
	
	$scope.$watchCollection('categories', function(newValue, oldValue) {
		updateSelectedCategory()
	})

	function updateSelectedCategory() {
		$scope.selectedCategory = _.detect($scope.categories, function(cat) {
			return cat.isSelected()
		})
	}

	$scope.$watch('selectedCategory', function(newValue, oldValue) {
		if (newValue == null)
			return;
		newValue.select()
		// updateTags()
		$scope.categorySelected({
			category : newValue
		})
	})

	$scope.$watchCollection('tags', function(newValue, oldValue) {
		var availableTags = _.filter($scope.tags, function(tag) {
			return tag.isAvailable()
		})
		if ($scope.tags.length > availableTags.length)
			$scope.tags = availableTags
	})

	$scope.$watchCollection('selectedTags', function(newValue, oldValue) {
		updateSelectedTagsByCategory(newValue)
	})

	function cleanUnavailableSelectedTags() {
		var ok = false
		while (!ok) {
			var selectedTags = _.select($scope.selectedTags, function(selTag) {
				return selTag.isSelected()
			})
			var availableSelectedTags = _.select(selectedTags, function(selTag) {
				return selTag.isAvailable()
			})
			var unavailableSelectedTags = _.reject(selectedTags, function(selTag) {
				return selTag.isAvailable()
			})
			_.each(unavailableSelectedTags, function(unavailableTag) {
				unavailableTag.unselect()
			})

			$scope.selectedTags = availableSelectedTags

			ok = unavailableSelectedTags.length == 0
		}
	}

	function toggleTagSelection(tag) {
		var selected = tag.toggleSelection()
		if (selected)
			$scope.selectedTags.push(tag)
		else
			cleanUnavailableSelectedTags()
	}

	function updateSelectedTagsByCategory(selectedTags){
		$scope.selectedTagsByCategory = _.groupBy(selectedTags, function(tag){
			return tag.category._id
		})
		//$log.log('tbyC',$scope.selectedTagsByCategory)
	}
	
	
	/*****************************************************************************
	 * Events
	 */

	$scope.categoryClicked = function(cat) {
		$scope.selectedCategory = cat
	}

	$scope.categoryExpandCollapseIconClicked = function(cat) {
		cat.toggleExpandCollapse()
	}

	$scope.categoryVisibleIconClicked = function(cat) {
		cat.toggleVisibility()
	}

	$scope.selectedTagExpandCollapseIconClicked = function(tag) {
		tag.toggleExpandCollapse()
	}

	$scope.tagSelectedIconClicked = function(tag) {
		toggleTagSelection(tag)
	}

});