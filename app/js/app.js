'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'myApp.data',
    'siyfion.sfTypeahead'
]).
config(['$routeProvider', function($routeProvider) {
    //$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/goals/data/test/',{templateUrl: 'models/goals-test.json'});
    $routeProvider.when('/goals/data/test/mis',{templateUrl: 'models/goals-mis.json'});
    $routeProvider.otherwise({redirectTo: '/view1'});
}]);
