'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ng',
    'ngRoute',
    'ActiveResource',
    'restangular',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'myApp.data',
    'siyfion.sfTypeahead'
])
.config(['$routeProvider', '$httpProvider', 'RestangularProvider', function(Router, $httpProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/');
    /*
    RestangularProvider.setBaseUrl('/api/');
    RestangularProvider.setExtraFields(['name']);
    RestangularProvider.setResponseExtractor(function(response, operation) {
        return response.data;
    });

    RestangularProvider.addElementTransformer('accounts', false, function(element) {
        element.accountName = 'Changed';
        return element;
    });

    RestangularProvider.setDefaultHttpFields({cache: true});
    RestangularProvider.setMethodOverriders(["put", "patch"]);

    // In this case we are mapping the id of each element to the _id field.
    // We also change the Restangular route.
    // The default value for parentResource remains the same.
    RestangularProvider.setRestangularFields({
        id: "_id",
        route: "restangularRoute",
        selfLink: "self.href"
    });

    RestangularProvider.setRequestSuffix('.json');

    // Use Request interceptor
    RestangularProvider.setRequestInterceptor(function(element, operation, route, url) {
        delete element.name;
        return element;
    });

    // ..or use the full request interceptor, setRequestInterceptor's more powerful brother!
    RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
        delete element.name;
        return {
            element: element,
            params: _.extend(params, {single: true}),
            headers: headers,
            httpConfig: httpConfig
        };
    });
    */
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);
