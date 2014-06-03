var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models');

exports.passport = passport;

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	models.BaseUser.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		models.BaseUser.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
            if (!user) { return done(null, false); }
			user.verifyPassword(password, function(err, isMatch) {
				if (err) { return done(err); }
				else if (!isMatch) { return done(null, false); }
				else { return done(null, user); }
			});
		});
	}
));

exports.authUser = function(req, resp, next) {
    if (req.isAuthenticated() && ['Admin', 'User'].indexOf(req.user._type) > -1) { 
        return next(); 
    }
    else { resp.status(401).send() };
}

exports.authOrganisation = function(req, resp, next) {
	if (req.isAuthenticated() && ['Admin', 'Organisation'].indexOf(req.user._type) > -1) { 
		return next(); 
	}
	else { resp.status(401).send() };
}

exports.authAdmin = function(req, resp, next) {
	if (req.isAuthenticated() && req.user._type === 'Admin') { 
		return next(); 
	}
	else { resp.status(401).send() };
}