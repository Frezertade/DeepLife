'use strict';

/* Services */

// Simple value service.
var skeletonServices = angular.module('skeleton.services', ['ngResource']).value('version', '0.1');

skeletonServices.filter('startFrom', function() {
	    return function(input, start) {
	        start = +start; //parse to int
	        return input.slice(start);
	    }
	});
