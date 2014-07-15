angular
  .module('app', ['ng', 'ngRoute', 'ActiveResource', 'simpleForm'])
  .config(['$routeProvider', '$httpProvider', function(Router, $httpProvider) {
    Router
      .when('/', {
        controller: 'MainCtrl'
      })
      .when('/post/:title', {
        controller: 'MainCtrl'
      });
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
