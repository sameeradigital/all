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
		$http.post('/api/users/', {
			user: user
		}).success(function(data) {
			cb(true);
		}).error(function(data) {
			cb(false, data);
		});
    };
    
    this.login = function(data, cb) {
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
    };
    
    this.logout = function() {
        self.userData = null;
        self.userProfiles = null;
        self.isLoggedIn = false;
        $cookieStore.remove('userData');
    };
    
    this.getUser = function(cb) {
         $http.get('/api/users/' + self.userData._id + '/').success(function(data) {
            self.userData = data;
            cb(true, data);
        }).error(function(data) {
            cb(false, data);
        });
    };
	
	this.putUser = function(cb) {
		$http.get('/api/users/' + self.userData._id + '/', {user: self.userData}).success(function(data) {
			cb(true, self.userData);
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
	
	$scope.validate = function() {
		if (!$scope.username) { 
			$scope.statusMessage = "Username is required";
		}
		else if (!$scope.email) { 
			$scope.statusMessage = "Email is required";
		}
		else if (!$scope.password) { 	
			$scope.statusMessage = "Password is required";
		}
		else if (!$scope.confirmPassword) { 
			$scope.statusMessage = "Confirm password required";
		}
		else if ($scope.password !== $scope.confirmPassword) { 
			$scope.statusMessage = "Passwords do not match";
		}
		return true;
	}
    
    $scope.signUp = function() {
		if ($scope.validate()) {
			$scope.isEnabled = false;
			UserService.signUp({
				username: $scope.username, 
				email: $scope.email,
				password: $scope.password,
				confirmPassword: $scope.confirmPassword
			}, function(isSuccess, responseMessage) {
				$scope.isEnabled = true;
				$scope.statusMessage = "Success!";
			});
		}
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
	
	$scope.validate = function() {
		if (!$scope.username) { 
			$scope.statusMessage = "Username is required"; 
		}
        else if (!$scope.password) { 
			$scope.statusMessage = "password is required"; 
		}
	};
    
    $scope.login = function() {
        $scope.isEnabled = false;
        UserService.login({
            username: $scope.username,
            password: $scope.password
        }, function(isSuccess, data) {
            isEnabled = true;
            if (isSuccess) {
				if (UserService.userData.address &&
				    UserService.userData.telephone &&
					UserService.userData.mobile) {
					$location.path('/profileListing');
				}
				else {
					$location.path('/account');
				}
            }
			else {
				$scope.statusMessage = data;
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
		else if (!$scope.profile.details.emergencyContactDetails1) {
			$scope.statusMessage = "Emergency contact details - 1 is required";
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
		else if (!$scope.profile.details.emergencyContactDetails2) {
            $scope.statusMessage = "Emergency contact details - 2 is required";
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
    $scope.userData = null;
	
	$scope.validate = function() {
	    $scope.statusMessage = null;
		if (!$scope.userData) {
			$scope.statusMessage = "User is null";
			return false;
		}
		else if (!$scope.userData.name) {
			$scope.statusMessage = "Name is required";
			return false;
		}
		else if (!$scope.userData.address) {
			$scope.statusMessage = "Address is required";
			return false;
		}
		else if (!$scope.userData.telephone) {
			$scope.statusMessage = "Telephone is required";
			return false;
		}
		else if (!$scope.userData.mobile) {
			$scope.statusMessage = "Mobile is required";
			return false;
		}
		return true;
	};
    
    $scope.loadUser = function() {
        $scope.isEnabled = false;
        UserService.getUser(function(isSuccess, data) {
            if (isSuccess) {
                $scope.userData = JSON.parse(JSON.stringify(UserService.userData));
            }
            else {
                $scope.statusMessage = data;
            }
            $scope.isEnabled = true;
        });
    };
	
	$scope.save = function() {
		if ($scope.validate()) {
			UserService.userData = $scope.userData;
			UserService.putUser(function(isSuccess, data) {
				if (isSuccess) {
					$scope.statusMessage = "Account updated";
				}
				else {
					$scope.statusMessage = data;
				}
				$scope.isEnabled = true;
			});
		}
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