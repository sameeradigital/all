var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models');
var routes = require('./routes');

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

var authUser = function(req, resp, next) {
	if (req.isAuthenticated() && ['Admin', 'User'].indexOf(req.user._type) > -1) { 
		return next(); 
	}
	else { resp.status(401).send() };
}

var authOrganisation = function(req, resp, next) {
	if (req.isAuthenticated() && ['Admin', 'Organisation'].indexOf(req.user._type) > -1) { 
		return next(); 
	}
	else { resp.status(401).send() };
}

var authAdmin = function(req, resp, next) {
	if (req.isAuthenticated() && req.user._type === 'Admin') { 
		return next(); 
	}
	else { resp.status(401).send() };
}

var app = express();
app.use(express.cookieParser());
app.use(express.session({secret: 'secretkey'}));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());

app.post('/api/sessions/', passport.authenticate('local'), routes.postSession);
app.get('/api/users/', authAdmin, routes.getUsers);
app.post('/api/users/', routes.postUser);
app.get('/api/users/:userId/', authUser, routes.getUser);
app.put('/api/users/:userId/', authUser, routes.putUser);
app.del('/api/users/:userId/', authUser, routes.deleteUser);
app.get('/api/users/:userId/profiles', authUser, routes.getUserProfiles);
app.post('/api/users/:userId/profiles/', authUser, routes.postProfile);
app.get('/api/users/:userId/profiles/:profileId', authUser, routes.getUserProfile);
app.put('/api/users/:userId/profiles/:profileId', authUser, routes.putUserProfile);
app.del('/api/users/:userId/profiles/:profileId', authUser, routes.delUserProfile);
app.get('/api/organisations/', routes.getOrganisations);
app.post('/api/organisations/', routes.postOrganisation);
app.get('/api/organisations/:organisationId/', routes.getOrganisation);
app.put('/api/organisations/:organisationId/', authOrganisation, routes.putOrganisation);
app.get('/api/organisations/:organisationId/profiles', authOrganisation, routes.getOrganisationProfiles);

module.exports = app;