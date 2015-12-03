/**
 * Database Factory
 */

irasDatabase.factory('irasDatabase',
		function($http, $q, $log) {
			var factory = {};

			var host = 'localhost:3000'

			var jsonURL = 'http://' + host + '/json'

			var serviceURL = 'http://' + host + '/service';

			function getJSONData(resource) {
				var deferred = $q.defer();
				$http({
					url : jsonURL + resource
				}).success(function(data) {
					return deferred.resolve(data);
				}).error(function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			}

			// /publication/info
			// /infos.json
			factory.getPublicationInfo = function() {
				return getJSONData('/infos.json')
			}

			// /ranking/slides
			// /slides.json
			factory.getSlides = function() {
				return getJSONData('/slides.json')
			}

			function getServiceData(resource) {
				var deferred = $q.defer();
				$http({
					url : serviceURL + resource
				}).success(function(data) {
					return deferred.resolve(data);
				}).error(function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			}

			factory.getCategories = function() {
				$log.log('getCategories')
				return getServiceData('/category/all')
			}

			factory.getCategoriesByIds = function(ids) {
				$log.log('getCategoriesByIds')
				return getServiceData('/category/ids/' + ids.join(','))
			}

			factory.getTagsForCategoryId = function(catId) {
				$log.log('getTagsFor')
				return getServiceData('/tag/catId/' + catId)
			}

			factory.getTagsWithDependenciesForCategoryId = function(catId) {
				$log.log('getTagsWithDependenciesForCategory')
				return getServiceData('/tag/dependencies/catId/' + catId)
			}

			factory.getTagByIdWithDependencies = function(id) {
				$log.log('getTagByIdWithDependencies')
				return getServiceData('/tag/id/dependencies/' + id)
			}

			factory.getTagByIdsWithDependencies = function(ids) {
				$log.log('getTagByIdsWithDependencies')
				return getServiceData('/tag/ids/dependencies/' + ids.join(','))//
			}

			factory.getIndicatorsForTags = function(tags) {
				$log.log('getIndicatorsForTags')
				return getServiceData('/indicator/tagIds/'
						+ _.pluck(tags, '_id').join(','))//
			}

			return factory;

		});