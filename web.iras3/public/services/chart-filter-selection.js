app.factory('chartFilterSelection', function($http, $q, $log, c, irasDatabase) {
	var factory = {}

	factory.categories = []
	factory.category = null
	factory.tags = []
	factory.selectedTags = []
	factory.visibleCategories = {}
	factory.expandedCategories = {}
	factory.expandedSelectedTags = {}

	factory.toggleTagSelection = toggleTagSelection
	factory.isTagSelected = isTagSelected
	factory.getSelectedTagsForCategory = getSelectedTagsForCategory
	factory.setCategory = setCategory
	factory.getSelectedDependenciesForTag = getSelectedDependenciesForTag
	factory.loadCategoriesByIds = loadCategoriesByIds
	factory.selectTagsByIds = selectTagsByIds
	factory.load = load

	factory.showCategory = showCategory
	factory.hideCategory = hideCategory
	factory.isCategoryVisible = isCategoryVisible
	factory.toggleCategoryVisible = toggleCategoryVisible

	factory.expandCategory = expandCategory
	factory.collapseCategory = collapseCategory
	factory.isCategoryCollapsed = isCategoryCollapsed
	factory.isCategoryExpanded = isCategoryExpanded
	factory.toggleExpandCollapseCategory = toggleExpandCollapseCategory

	factory.expandSelectedTag = expandSelectedTag
	factory.collapseSelectedTag = collapseSelectedTag
	factory.isSelectedTagCollapsed = isSelectedTagCollapsed
	factory.isSelectedTagExpanded = isSelectedTagExpanded
	factory.toggleExpandCollapseSelectedTag = toggleExpandCollapseSelectedTag

	var categoryIds = [ 'YR', 'SS', 'DS', 'GE', 'NA', 'SSYS', 'IT', 'IN', 'CO',
			'SE', 'SP' ]

	var tagIds = [ 'YR-2014', 'YR-2013', 'SS-FRE', 'DS-POSGRA', 'GE-MAL',
			'NA-SAU', 'SSYS-MAS', 'IT-PUBUNI', 'IN-KINABDUNI', 'CO-SCI', 'SE-PHY',
			'SP-PHY' ]

	var initialized = false;

	function load() {
		function loadTags() {
			return selectTagsByIds(tagIds)//	
		}

		function initialize() {
			return initialized = true
		}

		function initVisibleCategories() {
			var categoryIds = _.pluck(factory.categories, '_id')
			_.each(categoryIds, function(id) {
				factory.visibleCategories[id] = true;
			})
		}

		var deferred = $q.defer();
		if (!initialized) {
			loadCategoriesByIds(categoryIds)//
			.then(loadTags)//
			.then(initVisibleCategories)//
			.then(initialize)//
			.then(function(data) {
				deferred.resolve(true);
			}, function error(error) {
				$log.error(error);
				deferred.reject(error);
			}, function notify(data) {
				deferred.notify(data);
			})
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	}

	/*****************************************************************************
	 * Categories
	 */

	function loadCategoriesByIds(catIds) {
		function categoriesLoaded(categories) {
			categories = _.sortBy(categories, function(cat) {
				return catIds.indexOf(cat._id)
			})
			setCategories(categories)
			return categories
		}
		function categoriesLoadError(err) {
			$log.error('loadCategories', err)
			throw err
		}
		return irasDatabase.getCategoriesByIds(catIds)//
		.then(categoriesLoaded, categoriesLoadError)
	}

	function setCategories(categories) {
		factory.categories = categories
		setCategory(categories[0])
	}

	function setCategory(category) {
		factory.category = category
		updateTagsForCategory(category)
	}

	/*****************************************************************************
	 * Tags
	 */

	function updateTagsForCategory(cat) {
		loadTagsWithDependenciesForCategory(cat)
	}

	function loadTagsWithDependenciesForCategory(cat) {

		function tagsWithDependenciesLoaded(tags) {
			// Improve by sending ids to the server to perform the query
			setTags(_.filter(tags, function(tag) {
				return isTagAvailable(tag)
			}))
		}

		function tagsWithDependenciesLoadError(err) {
			$log.error('loadTagsWithDependenciesForCategory', err)
			throw err
		}

		return irasDatabase.getTagsWithDependenciesForCategory(cat).then(
				tagsWithDependenciesLoaded, tagsWithDependenciesLoadError)
	}

	function setTags(tags) {
		factory.tags = tags
	}

	function isTagAvailable(tag) {
		if (tag.dependencies < 1)
			return true;
		var ids = _.pluck(factory.selectedTags, '_id');
		return _.any(tag.dependencies, function(dep) {
			return _.all(dep.tags, function(tag) {
				return _.contains(ids, tag._id)
			})
		})
	}

	function toggleTagSelection(tag) {
		function updateSelection() {
			var len = factory.selectedTags.length
			factory.selectedTags = _.select(factory.selectedTags, function(tag) {
				return isTagAvailable(tag)
			})
			if (len > factory.selectedTags.length)
				updateSelection();
		}

		var ids = _.pluck(factory.selectedTags, '_id')
		var index = ids.indexOf(tag._id);
		if (index >= 0)
			factory.selectedTags.splice(index, 1);
		else
			factory.selectedTags.push(tag);
		updateSelection();
	}

	function isTagSelected(tag) {
		var ids = _.pluck(factory.selectedTags, '_id')
		return _.contains(ids, tag._id)
	}

	function getSelectedTagsForCategory(cat) {
		return _.select(factory.selectedTags, function(tag) {
			return tag.category._id == cat._id
		})
	}

	function getSelectedDependenciesForTag(tag) {
		// $log.log('Deps', tag.dependencies)
		var ids = _.pluck(factory.selectedTags, '_id')
		return _.filter(tag.dependencies, function(dep) {
			return _.all(dep.tags, function(depTag) {
				return _.contains(ids, depTag._id)
			})
		})
	}

	function selectTagsByIds(tagIds) {
		// $log.log('selectTagsByIds', tagIds)

		function tagsLoaded(tags) {
			// $log.log(tags)
			tags = _.sortBy(tags, function(tag) {
				return tagIds.indexOf(tag._id)
			})
			_.each(tags, function(tag) {
				if (!isTagSelected(tag))
					toggleTagSelection(tag);
			})
			return tags
		}

		function tagsLoadError(err) {
			$log.error('loadCategories', err)
			throw err
		}

		return irasDatabase.getTagByIdsWithDependencies(tagIds)//
		.then(tagsLoaded, tagsLoadError)

	}

	/*****************************************************************************
	 * Category visibility
	 */

	function showCategory(cat) {
		factory.visibleCategories[cat._id] = cat
	}

	function isCategoryVisible(cat) {
		return factory.visibleCategories[cat._id]
	}

	function hideCategory(cat) {
		if (isCategoryVisible(cat))
			delete factory.visibleCategories[cat._id]
	}

	function toggleCategoryVisible(cat) {
		if (isCategoryVisible(cat))
			hideCategory(cat)
		else
			showCategory(cat)
	}

	/*****************************************************************************
	 * Category expansion
	 */

	function expandCategory(cat) {
		factory.expandedCategories[cat._id] = cat
	}

	function isCategoryExpanded(cat) {
		return factory.expandedCategories[cat._id] != null
	}

	function isCategoryCollapsed(cat) {
		return factory.expandedCategories[cat._id] == null
	}

	function collapseCategory(cat) {
		if (isCategoryExpanded(cat))
			delete factory.expandedCategories[cat._id];
	}

	function toggleExpandCollapseCategory(cat) {
		if (isCategoryExpanded(cat))
			collapseCategory(cat);
		else
			expandCategory(cat);
	}

	/*****************************************************************************
	 * Tag expansion
	 */

	function expandSelectedTag(tag) {
		factory.expandedSelectedTags[tag._id] = tag
	}

	function isSelectedTagExpanded(tag) {
		return factory.expandedSelectedTags[tag._id] != null
	}

	function isSelectedTagCollapsed(tag) {
		return factory.expandedSelectedTags[tag._id] == null
	}

	function collapseSelectedTag(tag) {
		if (isSelectedTagExpanded(tag))
			delete factory.expandedSelectedTags[tag._id];
	}

	function toggleExpandCollapseSelectedTag(tag) {
		if (isSelectedTagExpanded(tag))
			collapseSelectedTag(tag);
		else
			expandSelectedTag(tag);
	}

	return factory
})