chartPage
		.controller(
				'ChartPageCtrl',
				function($scope, $log, $location, c, chartCategorySrv, chartTagSrv, chartSelectionSrv, chartBuilder) {
					$log.log('ChartPage controller loaded!')

					var selection = chartSelectionSrv.getSelection('2-15')
				})