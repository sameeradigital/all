var allershare = angular.module('allershare', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

allershare.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/homePage.html'
    }).when('/facts', {
        templateUrl: 'templates/facts.html'
    }).when('/faq', {
        templateUrl: 'templates/faq.html'
    }).when('/newsAlerts', {
        templateUrl: 'templates/newsAlerts.html'
    }).when('/contact', {
        templateUrl: 'templates/contact.html'
    }).when('/profileListing', {
        templateUrl: 'templates/profileListing.html'
    }).when('/createProfile', {
        templateUrl: 'templates/createProfile.html'
    }).when('/profileDetail/:profileId', {
        templateUrl: 'templates/profileDetail.html'
    }).when('/profileOverview/:profileId', {
        templateUrl: 'templates/profileOverview.html'
    }).when('/account', {
        templateUrl: 'templates/account.html'
    });
});

allershare.service('UserService', function($http, $cookieStore) {
    var self = this;
    this.userData = $cookieStore.get('userData');
    this.userProfiles = [];
    this.isLoggedIn = this.userData ? true : false;
    
    this.onUserChanged = function() {
        $cookieStore.put('userData', self.userData);
    };
    
    this.signUp = function(user, cb) {
        if (!user.username) { cb(false, "Username is required"); }
        else if (!user.email) { cb(false, "Email is required"); }
        else if (!user.password) { cb(false, "Password is required"); }
        else if (!user.confirmPassword) { cb(false, "Confirm password required"); }
        else if (user.password !== data.confirmPassword) { cb(false, "Passwords do not match"); }
        else {
            $http.post('/api/users/', {
                user: user
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
                self.onUserChanged();
                cb(true);
            }).error(function(data) {
                cb(false, data);
            });
        }
    };
    
    this.logout = function() {
        self.userData = null;
        self.userProfiles = null;
        self.isLoggedIn = false;
        $cookieStore.del('userData');
    };
    
    this.getUser = function(cb) {
         $http.get('/api/users/' +self.userData._id + '/').success(function(data) {
            self.userData = data;
            cb(true, data);
        }).error(function(data) {
            cb(false, data);
        });
    };
    
    this.getProfile = function(profileId, cb) {
        for (var i=0; i < self.userProfiles.length; i++) {
            if (self.userProfiles[i]._id === profileId) {
                cb(true, self.userProfiles[i]);
            }
        }
        $http.get('/api/users/' + self.userData._id + '/profiles/' + profileId).success(function(data) {
            cb(true, data);
        }).error(function(data) {
            cb(false, data);
        });
    };
    
    this.getProfiles = function(cb) {
        $http.get('/api/users/' + self.userData._id + '/profiles/').success(function(data) {
            self.userProfiles = data;
            cb(true);
        }).error(function(data) {
            cb(false, data);
        });
    };
    
    this.postProfile = function(profile, cb) {
        $http.post('/api/users/' + self.userData._id + '/profiles/', {profile: profile}).success(function(data) { 
            cb(true);
        }).error(function(data, status) { 
            self.userProfiles.push(data);
            cb(false, data);
        });
    };
    
    this.deleteProfile = function(profile, cb) {
        $http.delete('/api/users/' + self.userData._id + '/profiles/' + profile._id).success(function(data) {
            cb(true);
            self.userProfiles.splice(self.userProfiles.indexOf(profile), 1);
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
    $scope.isLoggedIn = UserService.isLoggedIn;
    
    $scope.$watch(UserService.isLoggedIn, function() {
        $scope.isLoggedIn = UserService.isLoggedIn;
    });
    
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
    
    $scope.logout = function() {
        UserService.logout();
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
        UserService.deleteProfile(profile, function(isSuccess, responseMessage) {
            $scope.isEnabled = true;
        });
    };

    $scope.createProfile = function() {
        $location.path('/createProfile');
    };
    
    $scope.viewProfile = function(profile) {
        $location.path('/profileOverview/' + profile._id);
    };
    
    $scope.loadUserProfiles();
});

allershare.controller('CreateProfileController', function($scope, $location, UserService) {
    $scope.isEnabled = true;
    $scope.statusMessage = null;
    $scope.profile = {};
    $scope.bloodTypes = ['a', 'b', 'ab', 'o'];
    $scope.ethnicities = ['white', 'mixed / multiple ethnic groups', 'asian / asian british', 
                                 'black / african / caribbean / black british', 'other ethnic group'];
    
    $scope.validate = function() {
        if (!$scope.profile.details) {
            $scope.statusMessage = "Please add all required fields";
            return false;
        }
        else if (!$scope.profile.details.name) {
            $scope.statusMessage = "Name is required";
            return false;
        }
        else if (!$scope.profile.details.address) {
            $scope.statusMessage = "Address is required";
            return false;
        }
        else if (!$scope.profile.details.dateOfBirth) {
            $scope.statusMessage = "Date of birth is required";
            return false;
        }
        else if (!$scope.profile.details.telephone) {
            $scope.statusMessage = "Telephone is required";
            return false;
        }
        else if (!$scope.profile.details.mobile) {
            $scope.statusMessage = "Mobile is required";
            return false;
        }
        else if (!$scope.profile.details.email) {
            $scope.statusMessage = "Email is required";
            return false;
        }
        else if (!$scope.profile.details.bloodType) {
            $scope.statusMessage = "Blood type is required";
            return false;
        }
        else if (!$scope.profile.details.ethnicity) {
            $scope.statusMessage = "Ethnicity is required";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails1.name) {
            $scope.statusMessage = "Name is required for emergency contact details - 1";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails1.address) {
            $scope.statusMessage = "Address is required for emergency contact details - 1";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails1.telephone) {
            $scope.statusMessage = "Telephone is required for emergency contact details - 1";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails1.mobile) {
            $scope.statusMessage = "Mobile is required for emergency contact details - 1";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails1.email) {
            $scope.statusMessage = "Email is required for emergency contact details - 1";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails2.name) {
            $scope.statusMessage = "Name is required for emergency contact details - 2";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails2.address) {
            $scope.statusMessage = "Address is required for emergency contact details - 2";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails2.telephone) {
            $scope.statusMessage = "Telephone is required for emergency contact details - 2";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails2.mobile) {
            $scope.statusMessage = "Mobile is required for emergency contact details - 2";
            return false;
        }
        else if (!$scope.profile.details.emergencyContactDetails2.email) {
            $scope.statusMessage = "Email is required for emergency contact details - 2";
            return false;
        }
        return true;
    };
    
    $scope.createProfile = function() {
        if ($scope.validate()) {
            $scope.isEnabled = false;
            UserService.postProfile($scope.profile, function(isSuccess, data) {
                if (isSuccess) {
                    $location.path('/profileListing');
                }
                else {
                    $scope.statusMessage = data;
                }
                $scope.isEnabled = true;
            });
        }
    };
});

allershare.controller('ProfileDetailController', function($scope, $routeParams, UserService) {
    $scope.isEnabled = true;
    $scope.statusMessage = null;
    $scope.profile = null;
    
    $scope.loadUserProfile = function() {
        $scope.statusMessage = null;
        $scope.isEnabled = false;
        UserService.getProfile($routeParams.profileId, function(isSuccess, data) {
            if (isSuccess) {
                $scope.profile = data;
            }
            else {
                $scope.statusMessage = data;
            }
            $scope.isEnabled = true;
        });
    };
    
    $scope.loadUserProfile();
});

allershare.controller('AccountController', function($scope, UserService) {
    $scope.isEnabled = true;
    $scope.statusMessage = null;
    $scope.user = null;
    
    $scope.loadUser = function() {
        $scope.statusMessage = null;
        $scope.isEnabled = false;
        UserService.getUser(function(isSuccess, data) {
            if (isSuccess) {
                $scope.user = data;
            }
            else {
                $scope.statusMessage = data;
            }
            $scope.isEnabled = true;
        });
    };
    
    $scope.loadUser();
});

allershare.controller('ProfileOverviewController', function($scope, $routeParams, UserService) {
    $scope.isEnabled = true;
    $scope.statusMessage = null;
    $scope.profile = null;
    
    $scope.loadProfile = function() {
        $scope.statusMessage = null;
        $scope.isEnabled = false;
        UserService.getProfile($routeParams.profileId, function(isSuccess, data) {
            if (isSuccess) {
                $scope.profile = data;
            }
            else {
                $scope.statusMessage = data;
            }
            $scope.isEnabled = true;
        });
    };
    
    $scope.loadProfile();
});