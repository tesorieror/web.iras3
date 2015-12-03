var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var db = require('/Users/ricardo.tesoriero/Gitrepo/db.iras/db.iras/db.js')
var c = require('/Users/ricardo.tesoriero/Documents/workspace_old/common.iras/common')

/* GET tag category by name */
router.get('/catIds/:categories', function(req, res) {
	var categories = req.params.categories.split(',');

	return db.instance.findTagByCategoryIds(categories)//
	.then(c.log('category/catIds/id', false), c.error('category/catIds/id'))//
	.then(c.sendData(res), c.sendError(res))// ;
});

router.get('/catId/:category', function(req, res) {
	return db.instance.findTagByCategoryId(req.params.category)//
	.then(c.log('catId/:category', false), c.error('catId/:category'))//
	.then(c.sendData(res), c.sendError(res))// ;
});

router.get('/dependencies/catId/:category', function(req, res) {
	return db.instance.findTagWithDependenciesByCategoryId(req.params.category)//
	.then(c.log('dependencies/catId/:category', false),
			c.error('dependencies/catId/:category'))//
	.then(c.sendData(res), c.sendError(res))// ;
});

router.get('/id/dependencies/:tagId', function(req, res) {
	return db.instance.findTagByIdWithDependencies(req.params.tagId)//
	.then(c.log('id/dependencies/:tagId', false),
			c.error('id/dependencies/:tagId'))//
	.then(c.sendData(res), c.sendError(res))// ;
});

router.get('/ids/dependencies/:tagIds', function(req, res) {
	return db.instance.findTagByIdsWithDependencies(req.params.tagIds.split(','))//
	.then(c.log('ids/dependencies/:tagIds', true),
			c.error('ids/dependencies/:tagIds'))//
	.then(c.sendData(res), c.sendError(res))// ;
});

module.exports = router;
