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
    $scope.confirmPassword = null;
    $scope.statusMessage = null;
    $scope.isEnabled = true;
    
    $scope.validate = function() {
        $scope.statusMessage = null;
        if (!$scope.username) {
            $scope.statusMessage = "Username is required";
            return false;
        }
        else if (!$scope.email) {
            $scope.statusMessage = "Email is required";
            return false;
        }
        else if (!$scope.password) {
            $scope.statusMessage = "Password is required";
            return false;
        }
        else if (!$scope.confirmPassword) {
            $scope.statusMessage = "Confirm password required";
            return false;
        }
        else if ($scope.password !== $scope.confirmPassword) {
            $scope.statusMessage = "Passwords do not match";
            return false;
        }
        return true;
    };
    
    $scope.signUp = function() {
        if ($scope.validate()) {
            $scope.isEnabled = false;
            $http.post('/api/users/', {
                username: $scope.username, 
                email: $scope.email,
                password: $scope.password 
            }).success(function(data) {
                $scope.isEnabled = true;
                $scope.statusMessage = "Success!";
            }).error(function(data) {
                $scope.isEnabled = true;
                $scope.statusMessage = data;
            });
        }
    };
});

allershare.controller('LoginController', function($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";
    $scope.statusMessage = null;
    $scope.isEnabled = true;
    
    $scope.validate = function() {
        $scope.statusMessage = null;
        if (!$scope.username) {
            $scope.statusMessage = "Username is required";
            return false;
        }
        else if (!$scope.password) {
            $scope.statusMessage = "password is required";
            return false;
        };
        return true;
    };
    
    $scope.login = function() {
        if ($scope.validate()) {
            $scope.isEnabled = false;
            $http.post('/api/sessions/', {
                username: $scope.username, 
                password: $scope.password 
            }).success(function(data) {
                $scope.isEnabled = true;
                $location.path('/profileListing');
            }).error(function(data) {
                $scope.isEnabled = true;
                $scope.statusMessage = data;
            });
        }
    };
});