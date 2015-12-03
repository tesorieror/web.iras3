commons.factory('c', function($http, $q, $log) {
	var factory = {}

	factory.log = log
	factory.error = error

	function log(msg, logData, json) {
		return function(data) {
			function logDataToConsole() {
				if (json)
					$log.log(JSON.stringify(data));
				else
					$log.log((data));
			}

			if (msg) {
				$log.log(msg)
				if (logData)
					logDataToConsole();
			} else
				logDataToConsole();
			return data;
		}
	}

	function error(msg) {
		return function(error) {
			if (msg)
				$log.error(msg);
			$log.error(error);
			throw error;
		}
	}

	return factory
})