var express = require('express');
var routes = require('./routes');
var security = require('./security');

var app = express();
app.set('views', __dirname + '\\..\\client\\views');
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({secret: 'secretkey'}));
app.use(express.bodyParser());
app.use(security.passport.initialize());
app.use(security.passport.session());
app.use(express.static(__dirname + '\\..\\client'));

app.get('/', function(req, resp) { resp.render('appView'); });
app.post('/api/sessions/', security.passport.authenticate('local'), routes.postSession);
app.get('/api/users/', security.authAdmin, routes.getUsers);
app.post('/api/users/', routes.postUser);
app.get('/api/users/:userId/', security.authUser, routes.getUser);
app.put('/api/users/:userId/', security.authUser, routes.putUser);
app.del('/api/users/:userId/', security.authUser, routes.deleteUser);
app.get('/api/users/:userId/profiles/', security.authUser, routes.getUserProfiles);
app.post('/api/users/:userId/profiles/', security.authUser, routes.postProfile);
app.get('/api/users/:userId/profiles/:profileId', security.authUser, routes.getUserProfile);
app.put('/api/users/:userId/profiles/:profileId', security.authUser, routes.putUserProfile);
app.del('/api/users/:userId/profiles/:profileId', security.authUser, routes.delUserProfile);
app.get('/api/organisations/', routes.getOrganisations);
app.post('/api/organisations/', routes.postOrganisation);
app.get('/api/organisations/:organisationId/', routes.getOrganisation);
app.put('/api/organisations/:organisationId/', security.authOrganisation, routes.putOrganisation);
app.get('/api/organisations/:organisationId/profiles', security.authOrganisation, routes.getOrganisationProfiles);
app.get('/api/newsAlerts/', routes.getNewsAlerts);

app.listen(5000);