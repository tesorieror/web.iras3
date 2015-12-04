chart.factory('chartTagSrv', function($http, $q, $log, database) {
	var factory = {}

	var selection = null;

	factory.setSelection = function(sel) {
		selection = sel
	}

	factory.loadTagsWithDependenciesForCategory = function(cat) {
		return database.getTagsWithDependenciesForCategoryId(cat._id)//
		.then(decorateTags)
	}

	function loadTagByIdsWithDependencies(ids) {
		return database.getTagByIdsWithDependencies(ids)//
		.then(decorateTags)
	}

	factory.loadSelectedTagsWithDependencies = function() {
		return loadTagByIdsWithDependencies(selection.getSelectedTagIds())
	}

	function decorateTags(tags) {
		function decorateTag(tag) {
			// Vars
			tag.selection = selection

			// Methods
			// Selection
			tag.select = function() {
				return tag.selection.selectTagId(tag._id)
			}
			tag.unselect = function() {
				return tag.selection.unselectTagId(tag._id)
			}
			tag.isSelected = function() {
				return tag.selection.isTagIdSelected(tag._id)
			}
			tag.toggleSelection = function() {
				return tag.selection.toggleTagIdSelection(tag._id)
			}
			// Expansion
			tag.collapse = function() {
				return tag.selection.collapseSelectedTagId(tag._id)
			}
			tag.expand = function() {
				return tag.selection.expandSelectedTagId(tag._id)
			}
			tag.isCollapsed = function() {
				return tag.selection.isSelectedTagIdCollapsed(tag._id)
			}
			tag.isExpanded = function() {
				return tag.selection.isSelectedTagIdExpanded(tag._id)
			}
			tag.toggleExpandCollapse = function() {
				return tag.selection.toggleExpandCollapseSelectedTagId(tag._id)
			}
			tag.isAvailable = function() {
				if (tag.dependencies < 1)
					return true;
				return _.any(tag.dependencies, function(dep) {
					return _.all(dep.tags, function(depTag) {
						return tag.selection.isTagIdSelected(depTag._id)
					})
				})
			}

			tag.hasSelectedDependencies = function() {
				// $log.log('tag',tag)
				return tag.getSelectedDependenciesForTag().length > 0
			}

			tag.getSelectedDependenciesForTag = function() {
				return _.filter(tag.dependencies, function(dep) {
					return _.all(dep.tags, function(depTag) {
						return tag.selection.isTagIdSelected(depTag._id)
					})
				})
			}

			return tag;
		}
		return _.map(tags, decorateTag)
	}

	return factory;
})
