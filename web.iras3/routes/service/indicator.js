var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var db = require('/Users/ricardo.tesoriero/Gitrepo/db.iras/db.iras/db.js')
var c = require('/Users/ricardo.tesoriero/Documents/workspace_old/common.iras/common')

router.get('/all', function(req, res) {

});

router.get('/tagIds/:tagIds', function(req, res) {
	var tagIds = req.params.tagIds.split(',');
	var tagByCategory = [];

	_.each(tagIds, function(tagId) {
		var catId = tagId.split('-')[0];
		if (tagByCategory[catId] == null)
			tagByCategory[catId] = [];
		tagByCategory[catId].push(tagId)
	})

	return db.instance.findIndicatorByCategoryIds(_.values(tagByCategory))//
	.then(c.log('/tagIds', false), c.error('/tagIds'))//
	.then(c.sendData(res), c.sendError(res))// ;

	// Indicator.find({
	// $and : _.map(idCollections, function(idCollection) {
	// return {
	// $or : _.map(idCollection, function(id) {
	// return {
	// _tags : new mongoose.Types.ObjectId(id)
	// };
	// })
	// };
	// })
	// })
});

module.exports = router;
