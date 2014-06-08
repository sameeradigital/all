var allershare = angular.module('allershare', ['ngRoute']);

allershare.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/homePage.html',
    }).when('/facts', {
        templateUrl: 'templates/facts.html',
    }).when('/faq', {
        templateUrl: 'templates/faq.html',
    }).when('/newsAlerts', {
        templateUrl: 'templates/newsAlerts.html',
    }).when('/contact', {
        templateUrl: 'templates/contact.html',
    }).when('/profileListing', {
        templateUrl: 'templates/profileListing.html',
    });
});

allershare.controller('SignUpController', function($scope, $http) {
    $scope.username = null;
    $scope.email = null;
    $scope.password = null;
    $scope.statusMessage = null;
    $scope.isEnabled = true;
    
    $scope.signUp = function() {
        $http.post('/api/users/', {
            username: $scope.username, 
            email: $scope.email,
            password: $scope.password 
        }).success(function(data) {
            
        }).error(function(data) {
        
        });
    };
});

allershare.controller('LoginController', function($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";
    $scope.statusMessage = null;
    $scope.isEnabled = true;
    
    $scope.login = function() {
        $scope.isEnabled = false;
        $http.post('/api/sessions/', {
            username: $scope.username, 
            password: $scope.password 
        }).success(function(data) {
            $scope.isEnabled = true;
            $location.path('/readerApp');
        }).error(function(data) {
            $scope.isEnabled = true;
            $scope.statusMessage = data;
        });
    };
});