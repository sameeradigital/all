var models = require('./models');
var mongoose = require('mongoose');

/*
Current limitations:
	Object id's that are passed are not checked, so the reference may not exist.
	Sensitive and unnecessary data is sent in responses (passwords, document versions).
*/

var objIdOr404 = function(idStr, resp) {
    try {
        return mongoose.Types.ObjectId(idStr);
    }
    catch (err) { 
        resp.status(404).send();
    }
}

exports.postSession = function(req, resp) {
	resp.status(201).send(req.user);
};

exports.getUsers = function(req, resp) {
    models.BaseUser.find({_type: 'User'}, function(err, data) {
        err ? resp.status(500).send(err) : resp.send(data);
    });
};

exports.postUser = function(req, resp) {
    if (req.body.user) {
        models.BaseUser.findOne({username: req.body.user.username}, function(err, data) {
            if (err) {
                resp.status(500).send(err);
            }
            else {
                if (data === null) {
                    models.User.create(req.body.user, function(err, result) {
                        err ? resp.status(500).send(err) : resp.status(201).send(result);
                    });
                }
                else {
                    resp.status(409).send("Username already exists");
                }
            }
        });
    }
    else {
        resp.status(401).send("user object required");
    }
};

exports.getUser = function(req, resp) {
    var userId = objIdOr404(req.params.userId, resp);
    models.BaseUser.findOne({_id: userId, _type: 'User'}, function(err, data) {
        err ? resp.status(500).send(err) : data === null ? resp.status(404).send() : resp.send(data);
    });
};

exports.putUser = function(req, resp) {
    var userId = objIdOr404(req.params.userId, resp);
    models.BaseUser.findOneAndUpdate({_id: userId, _type: 'User'}, req.body, function(err, data) {
        err ? resp.status(500).send(err) : data === null ? resp.status(404).send() : resp.send(data);
    });
};

exports.deleteUser = function(req, resp) {
    var userId = objIdOr404(req.params.userId, resp);
    models.User.findOneAndRemove({_id: userId, _type: 'User'}, function(err, data) {
        err ? resp.status(500).send(err) : data === null ? resp.status(404).send() : resp.send(data);
    });
};

exports.getUserProfiles = function(req, resp) {
    var userId = objIdOr404(req.params.userId, resp);
    models.Profile.find({owner: userId}, function(err, data) {
        err ? resp.status(500).send(err) : resp.send(data);
    });
};

exports.postProfile = function(req, resp) {
    var userId = objIdOr404(req.params.userId, resp);
    if (userId !== null) {
        models.BaseUser.findOne({_id: userId, _type: 'User'}, function(err, data) {
            if (err) {
                resp.status(500).send(err);
            }
            else if (data === null) {
                resp.status(404).send();
            }
            else {
                var profile = new models.Profile(req.body.profile);
                profile.owner = data._id;
                profile.save(function(err, result) {
                    err ? resp.status(500).send(err) : resp.send(result);
                });
            }
        });
    }
};

exports.getUserProfile = function(req, resp) {
    var userId = objIdOr404(req.params.userId, resp);
    var profileId = objIdOr404(req.params.profileId, resp);
    models.Profile.findOne({_id: profileId, owner: userId}, function(err, data) {
        err ? resp.status(500).send(err) : data === null ? resp.status(404).send() : resp.send(data);
    });
};

exports.putUserProfile = function(req, resp) {
	var userId = objIdOr404(req.params.userId, resp);
    var profileId = objIdOr404(req.params.profileId, resp);
    models.Profile.findOneAndUpdate({_id: profileId, owner: userId}, req.body, function(err, result) {
		err ? resp.status(500).send(err) : resp.send(result);
    });
};

exports.delUserProfile = function(req, resp) {
	var userId = objIdOr404(req.params.userId, resp);
    var profileId = objIdOr404(req.params.profileId, resp);
    models.Profile.findOneAndRemove({_id: profileId, owner: userId}, function(err, result) {
		err ? resp.status(500).send(err) : resp.send(result);
    });
};

exports.getOrganisations = function(req, resp) {
	models.BaseUser.find({_type: 'Organisation'}, function(err, data) {
        err ? resp.status(500).send(err) : resp.send(data);
    });
};

exports.postOrganisation = function(req, resp) {
	models.BaseUser.findOne({username: req.body.username}, function(err, data) {
		if (err) { resp.status(500).send(err); }
		else if (data !== null) { resp.status(409).send('Username already exists'); }
		else {
			models.Organisation.findOne({organisationName: req.body.organisationName}, function(err, data) {
				if (err) { resp.status(500).send(err); }
				else if (data !== null) { resp.status(409).send("Organisation name already exists"); }
				else {
					var organisation = new models.Organisation(req.body);
					organisation.save(function(err, result) {
						err ? resp.status(500).send(err) : resp.status(201).send(result);
					});
				}
			});
		}
	});
};

exports.getOrganisation = function(req, resp) {
	var organisationId = objIdOr404(req.params.organisationId, resp);
    models.Organisation.findOne({_id: organisationId, _type: 'Organisation'}, function(err, data) {
        err ? resp.status(500).send(err) : data === null ? resp.status(404).send() : resp.send(data);
    });
};

exports.putOrganisation = function(req, resp) {
    var organisationId = objIdOr404(req.params.organisationId, resp);
    models.Organisation.findOneAndUpdate({_id: organisationId, _type: 'Organisation'}, req.body, function(err, data) {
        err ? resp.status(500).send(err) : data === null ? resp.status(404).send() : resp.send(data);
    });
};

exports.getOrganisationProfiles = function(req, resp) {
	var organisationId = objIdOr404(req.params.organisationId, resp);
	models.Profile.find({organisations: organisationId}, function(err, data) {
		err ? resp.status(500).send(err) : resp.send(data);
	});
};

exports.getNewsAlerts = function(req, resp) {
	models.NewsAlert.find({}, function(err, data) { 
		err ? resp.status(500).send(err) : resp.send(data);
	});
};

exports.postMessage = function(req, resp) {
    var message = new models.Message(req.body.message);
    message.save(function(err, result) {
        err ? resp.status(500).send(err) : resp.send(result);
    });
};