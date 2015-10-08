'use strict';

jd.factory.newModule('core', {
    internalDeps: [
        // insert shared deps into the module, e.g.: directives, filters, controllers...
    ],
    config: ['$httpProvider', 'jedi.utilities.UtilitiesProvider', function($httpProvider, Utilities) {
    	var $log = angular.injector(['ng']).get('$log');
    	$log.info('Test config module');
    }],
    run: ['$log', 'jedi.utilities.Utilities', function($log, Utilities) {
    	$log.info('Test run module');
    }]
});