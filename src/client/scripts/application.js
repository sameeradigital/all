var allershare = angular.module('allershare', ['ngRoute']);

allershare.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/homePage.html',
        controller: 'HomePageController'
    }).when('/facts', {
        templateUrl: 'templates/facts.html',
        controller: 'FactsController'
    }).when('/faq', {
        templateUrl: 'templates/faq.html',
        controller: 'FaqController'
    }).when('/newsAlerts', {
        templateUrl: 'templates/newsAlerts.html',
        controller: 'NewsAlertsController'
    }).when('/contact', {
        templateUrl: 'templates/contact.html',
        controller: 'ContactController'
    });
});

allershare.controller('HomePageController', function($scope, $http) {

});

allershare.controller('FactsController', function($scope, $http) {
    
});

allershare.controller('FaqController', function($scope, $http) {
    
});

allershare.controller('NewsAlertsController', function($scope, $http) {
    
});

allershare.controller('ContactController', function($scope, $http) {
    
});