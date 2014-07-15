'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ng',
    'ngRoute',
    'ActiveResource',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'myApp.data',
    'siyfion.sfTypeahead'
])
.config(['$routeProvider', '$httpProvider', function(Router, $httpProvider) {
    Router
        /* TODO: What needs to be routed?
        .when('/', {
            controller: 'MainCtrl'
        })
        .when('/post/:title', {
            controller: 'MainCtrl'
        });
        */
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
