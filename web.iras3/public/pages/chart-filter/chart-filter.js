/**
 * ChartFilter
 */

app.controller('ChartFilterCtrl',
		function($scope, $log, $location, c, chartFilterSelection, chartBuilder) {
			$log.log('ChartFilter controller loaded!')

			$scope.activePath = $location.path()
			$scope.chartModeClicked = chartModeClicked

			$scope.selection = chartFilterSelection
			$scope.builder = chartBuilder

			// $scope.selection.loadCategoriesByIds([ 'YR', 'SS', 'DS', 'GE', 'NA',
			// 'SSYS', 'IT', 'IN', 'CO', 'SE', 'SP' ]);
			//
			// $scope.selection.selectTagsByIds([ 'YR-2014', 'YR-2013', 'SS-FRE',
			// 'DS-POSGRA', 'GE-MAL', 'NA-SAU', 'SSYS-MAS', 'IT-PUBUNI',
			// 'IN-KINABDUNI', 'CO-SCI', 'SE-PHY', 'SP-PHY' ])

			chartFilterSelection.load().then(c.log('ChartFilterSelection OK!'),
					c.error('ChartFilterSelection'))

			/*************************************************************************
			 * Navigation
			 */

			function chartModeClicked() {
				$location.path('/pages/chart')
			}

		})