var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var bcrypt = require('bcrypt-nodejs');

SALT_WORK_FACTOR = 10;

var NewsAlertSchema = mongoose.Schema({
    created: { type: Date, required: true },
    heading: { type: String, required: true },
    body: { type: String, required: true }
});

var BaseUserSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isActivated: { type: String, required: true }
}, {collection: 'UsersCollection', discriminatorKey : '_type' });

var AdminSchema = BaseUserSchema.extend({ });

var OrganisationSchema = BaseUserSchema.extend({
    organisationName: {type: String, required: true},
    registeredAddress: {type: String, required: true},
    postalAddress: {type: String, required: true},
    contactNumber: {type: String, required: true}
}); 

var ProfileSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    bloodType: String,
    ethnicGroup: String,
    nhsNumber: String,
    emergencyContactDetails: [
        {
            firstName: String,
            lastName: String,
            telNum: String,
            mobNum: String,
            email: String
        }
    ],
    medicalConditions: String,
    medicalRequirments: String,
    medicalImplants: String,
    foodAllergies: [String],
    foodIntolerances: [String],
    respiratoryAllergies: [String],
    skinAllergies: [String],
    animalInsectAllergies: [String],
    drugAllergies: [String],
    chemicalAllergies: [String],
    miscAllergies: [String],
    dietaryRequirements: [String],
    organisations: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Organisation'} ]
});

var UserSchema = BaseUserSchema.extend({ });

preSave = function(next) {
    var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
};

verifyPassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


AdminSchema.pre('save', preSave);
UserSchema.pre('save', preSave);
OrganisationSchema.pre('save', preSave);
AdminSchema.methods.verifyPassword = verifyPassword;
UserSchema.methods.verifyPassword = verifyPassword;
OrganisationSchema.methods.verifyPassword = verifyPassword;

exports.NewsAlert = mongoose.model('NewsAlert', NewsAlertSchema);
exports.BaseUser = mongoose.model('BaseUser', BaseUserSchema);
exports.AdminUser = mongoose.model('Admin', AdminSchema);
exports.Organisation = mongoose.model('Organisation', OrganisationSchema);
exports.Profile = mongoose.model('Profile', ProfileSchema);
exports.User = mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/allerShare');
