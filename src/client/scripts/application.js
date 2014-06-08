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
    }).when('/createProfile', {
        templateUrl: 'templates/createProfile.html',
    });
});

allershare.service('UserService', function($http) {
    var self = this;
    
    this.userData = null;
    this.userProfiles = null;
    this.isLoggedIn = false;
    
    this.signUp = function(data, cb) {
        if (!data.username) { cb(false, "Username is required"); }
        else if (!data.email) { cb(false, "Email is required"); }
        else if (!data.password) { cb(false, "Password is required"); }
        else if (!data.confirmPassword) { cb(false, "Confirm password required"); }
        else if (data.password !== data.confirmPassword) { cb(false, "Passwords do not match"); }
        else {
            $http.post('/api/users/', {
                username: data.username, 
                email: data.email,
                password: data.password 
            }).success(function(data) {
                cb(true);
            }).error(function(data) {
                cb(false, data);
            });
        }
    };
    
    this.login = function(data, cb) {
        if (!data.username) { cb(false, "Username is required"); }
        else if (!data.password) { cb(false, "password is required"); }
        else {
            $http.post('/api/sessions/', {
                username: data.username, 
                password: data.password 
            }).success(function(data) {
                self.userData = data;
                self.isLoggedIn = true;
                cb(true);
            }).error(function(data) {
                cb(false, data);
            });
        }
    };
    
    this.getProfiles = function(cb) {
        $http.get('/api/users/' + self.userData._id + '/profiles/').success(function(data) {
            self.userProfiles = data;
            cb(true);
        }).error(function(data) {
            cb(false, data);
        });
    };
    
    this.postProfile = function(data, cb) {
    
    };
    
    this.deleteProfile = function(profileId, cb) {
        $http.delete('/api/users/' + self.userData + '/profiles/' + profileId).success(function(data) {
            cb(true);
        }).error(function(data) {
            cb(true, data);
        });
    };
    
    return this;
});

allershare.controller('SignUpController', function($scope, UserService) {
    $scope.username = null;
    $scope.email = null;
    $scope.password = null;
    $scope.confirmPassword = null;
    $scope.statusMessage = null;
    $scope.isEnabled = true;
    
    $scope.signUp = function() {
        $scope.isEnabled = false;
        UserService.signUp({
            username: $scope.username, 
            email: $scope.email,
            password: $scope.password,
            confirmPassword: $scope.confirmPassword
        }, function(isSuccess, responseMessage) {
            $scope.isEnabled = true;
            $scope.statusMessage = responseMessage;
        });
    };
});

allershare.controller('LoginController', function($scope, $location, UserService) {
    $scope.username = "";
    $scope.password = "";
    $scope.statusMessage = null;
    $scope.isEnabled = true;
    
    $scope.login = function() {
        $scope.isEnabled = false;
        UserService.login({
            username: $scope.username,
            password: $scope.password
        }, function(isSuccess, responseMessage) {
            isEnabled = true;
            $scope.statusMessage
            if (isSuccess) {
                $location.path('/profileListing');
            }
        });
    };
});

allershare.controller('ProfileListingController', function($scope, $location, UserService) {
    $scope.isEnabled = true;
    $scope.profiles = null;
    
    $scope.loadUserProfiles = function() {
        $scope.isEnabled = false;
        UserService.getProfiles(function(isSuccess, responseMessage) {
            $scope.profiles = UserService.userProfiles;
        });
    };
    
    $scope.deleteProfile = function(profile) {
        $scope.isEnabled = false;
        UserService.deleteProfile(profile._id, function(isSuccess, responseMessage) {
            $scope.isEnabled = true;
            if (isSuccess) {
                UserService.userProfiles.splice(UserService.indexof(profile), 1);
            }
        });
    };

    $scope.createProfile = function() {
        $location.path('/createProfile');
    };
});

allershare.controller('CreateProfileController', function($scope, $location, UserService) {
    
});