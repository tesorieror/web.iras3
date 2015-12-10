/**
 * http://usejsdoc.org/
 */
// 'angularSpinner', 'ngAnimate'
// ["ngRoute"]
var app = angular.module('app', [ 'ngRoute', 'ngAnimate', 'ui.bootstrap',
		'googlechart', 'chartFilterPage0215', 'plainFullTableChartPage0215','fullTableChartPage0215',
		'summaryTableChartPage0215', 'descriptionTableChartPage0215','columnChartPage0215' ]);

/**
 * Avoid cache (review this for optimization)
 */
app.config([ '$httpProvider', function($httpProvider) {
	// initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
} ]);
