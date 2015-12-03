var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');
var db = require('/Users/ricardo.tesoriero/Gitrepo/db.iras/db.iras/db.js')
var c = require('/Users/ricardo.tesoriero/Documents/workspace_old/common.iras/common')

router.get('/all', function(req, res) {
	console.log('/all before DB query');
	db.instance.findAllCategories()//
	.then(c.log('category/all', false), c.error('category/all'))//
	.then(c.sendData(res), c.sendError(res))//
	.done()
});

router.get('/id/:id', function(req, res) {
	var id = req.params.id;
	db.instance.findTagCategoryById(id)//
	.then(c.log('category/id', false), c.error('category/id'))//
	.then(c.sendData(res), c.sendError(res))//
	.done()
});

router.get('/ids/:ids', function(req, res) {
	var ids = req.params.ids.split(',');
	db.instance.findCategoriesByIds(ids)//
	.then(c.log('category/ids', false), c.error('category/ids'))//
	.then(c.sendData(res), c.sendError(res))//
	.done()
});


/* GET tag category by name */
// router.get('/:names', function(req, res) {
//
// var result;
//
// function loadTagCategoriesFor(names) {
// return q.all(_.map(names, function(n) {
// return TagCategory.find({
// 'name' : n
// });
// }));
// }
//
// function populateTags(tagCategories) {
// return q.all(_.map(tagCategories, function(tc) {
// return Tag.populate(tc, '_tags');
// }));
// }
//
// function sendData(data) {
// // console.log("sendData", data);
// // console.log(data);
// res.send(data);
// res.status(200).end();
// }
//
// function sendError(err) {
// // console.error("sendError", err);
// res.send(err);
// res.status(500).end();
// }
//
// function populateTagDependencies(data) {
// // console.log('populate tag dependences');
// var categories = _.flatten(data);
// var promises = [];
// _.each(categories, function(cat) {
// _.each(cat._tags, function(tag) {
// promises.push(Tag.populate(tag, '_tags'));
// promises.push(TagDependency.populate(tag, '_dependencies').then(function(tag)
// {
// // console.log("DEP", tag._dependencies);
// return q.all(_.map(tag._dependencies, function(dep) {
// return (Tag.populate(dep, '_tags'));
// }));
// }));
// });
// });
// return q.all(promises).then(function(data) {
// // console.log("D",data);
// return categories;
// });
// }
//
// var names = req.params.names.split(',');
//
// loadTagCategoriesFor(names)//
// .then(populateTags)//
// .then(populateTagDependencies)//
// .then(sendData, sendError);
// });
// return q.nbind(Tag.populate, Tag)(tag, '_tags');
module.exports = router;
