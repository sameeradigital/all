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
    organisations: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Organisation'} ],
    details: {
        name: {type: String, required: true},
        address: {type: String, required: true},
        dateOfBirth: {type: String, required: true},
        bloodType: {type: String, required: true},
        ethnicity: {type: String, required: true},
        nhsNumber: String,
        emergencyContactDetails1: {
                name: {type: String, required: true},
                address: {type: String, required: true},
                telephone: {type: String, required: true},
                mobile: {type: String, required: true},
                email: {type: String, required: true}
        },
        emergencyContactDetails2: {
                name: {type: String, required: true},
                address: {type: String, required: true},
                telephone: {type: String, required: true},
                mobile: {type: String, required: true},
                email: {type: String, required: true}
        },
        medicalConditions: String,
        medicalRequirments: String,
        medicalImplants: String
    },
    allergiesAndIntolerances: {
        allergies: {
            beefAndDerivatives: {type: Boolean, reqiured: true, default: false},
            chickenAndDervatives: {type: Boolean, reqiured: true, default: false},
            lambMuttonAndDerivatives: {type: Boolean, reqiured: true, default: false},
            porkDerivatives: {type: Boolean, reqiured: true, default: false},
            otherAnimalProductsAndDerivatives: {type: Boolean, reqiured: true, default: false},
            rennet: {type: Boolean, reqiured: true, default: false},
            gelatin: {type: Boolean, reqiured: true, default: false},
            oilsOfSeafood: {type: Boolean, reqiured: true, default: false},
            nutOilsAndDerivatives: {type: Boolean, reqiured: true, default: false},
            seedsAndProducts: {type: Boolean, reqiured: true, default: false},
            seedDerivatives: {type: Boolean, reqiured: true, default: false},
            seedOilOrOtherVegetableOils: {type: Boolean, reqiured: true, default: false},
            coconutsAndDerivatives: {type: Boolean, reqiured: true, default: false},
            poppySeeds: {type: Boolean, reqiured: true, default: false},
            cottonSeeds: {type: Boolean, reqiured: true, default: false}
        },
        foodAllergies: {
            cerealsContainingGluten: {type: Boolean, reqiured: true, default: false},
            shellfishCrustaceans: {type: Boolean, reqiured: true, default: false},
            eggAndProducts: {type: Boolean, reqiured: true, default: false},
            fishOrSeafood: {type: Boolean, reqiured: true, default: false},
            milkAndProducts: {type: Boolean, reqiured: true, default: false},
            nutsAndProducts: {type: Boolean, reqiured: true, default: false},
            celeryAndProducts: {type: Boolean, reqiured: true, default: false},
            mustardAndProducts: {type: Boolean, reqiured: true, default: false},
            sesemeAndProducts: {type: Boolean, reqiured: true, default: false},
            sulphurDioxideAndSulphites: {type: Boolean, reqiured: true, default: false},
            lupinAndProducts: {type: Boolean, reqiured: true, default: false},
            molluscsAndProducts: {type: Boolean, reqiured: true, default: false},
            fruitOrVegetables: {type: Boolean, reqiured: true, default: false},
            oralAllergyOrPollenFoodSyndrome: {type: Boolean, reqiured: true, default: false},
            alcoholAllergy: {type: Boolean, reqiured: true, default: false}
        },
        botanical: {
            garlicAndDerivatives: {type: Boolean, reqiured: true, default: false},
            onionAndDerivatives: {type: Boolean, reqiured: true, default: false},
            cinnamonAndExtract: {type: Boolean, reqiured: true, default: false},
            umberlliferaeAndDerivatives: {type: Boolean, reqiured: true, default: false},
            vegetablesAndDerivatives: {type: Boolean, reqiured: true, default: false},
            fruitAndDerivatives: {type: Boolean, reqiured: true, default: false},
            cocoaAndDerivatives: {type: Boolean, reqiured: true, default: false},
            potatoAndDerivatives: {type: Boolean, reqiured: true, default: false},
            maizeAndDerivatives: {type: Boolean, reqiured: true, default: false},
            leguminousPlants: {type: Boolean, reqiured: true, default: false},
            coriander: {type: Boolean, reqiured: true, default: false},
            vanila: {type: Boolean, reqiured: true, default: false},
            mushroom: {type: Boolean, reqiured: true, default: false}
        },
        flavourings: {
            naturalFlavouringSubstances: {type: Boolean, reqiured: true, default: false},
            naturallyIdenticalFlavouringSubstances: {type: Boolean, reqiured: true, default: false},
            artificialFlavouringSubstances: {type: Boolean, reqiured: true, default: false},
            flavouringPreparations: {type: Boolean, reqiured: true, default: false},
            smokeFlavourings: {type: Boolean, reqiured: true, default: false},
            processFlavourings: {type: Boolean, reqiured: true, default: false},
            diAcetyl: {type: Boolean, reqiured: true, default: false},
            msg: {type: Boolean, reqiured: true, default: false},
            biologicallyActivePrinciples: {type: Boolean, reqiured: true, default: false},
            naturallyOccuringGlutamates: {type: Boolean, reqiured: true, default: false},
            nucleotides: {type: Boolean, reqiured: true, default: false},
            yeastAndExtract: {type: Boolean, reqiured: true, default: false},
            hvp: {type: Boolean, reqiured: true, default: false},
            tvp: {type: Boolean, reqiured: true, default: false},
            otherAddedFlavourEnhancers: {type: Boolean, reqiured: true, default: false},
            alcohols: {type: Boolean, reqiured: true, default: false},
            organicAcids: {type: Boolean, reqiured: true, default: false},
            caffeine: {type: Boolean, reqiured: true, default: false},
            quinine: {type: Boolean, reqiured: true, default: false},
            maltExtract: {type: Boolean, reqiured: true, default: false},
            emulsifiers: {type: Boolean, reqiured: true, default: false},
            maltodextrin: {type: Boolean, reqiured: true, default: false},
            enzymes: {type: Boolean, reqiured: true, default: false}
        },
        colours: {
            naturalColours: {type: Boolean, reqiured: true, default: false},
            artificialColours: {type: Boolean, reqiured: true, default: false},
            artificialColourFromAzoDyes: {type: Boolean, reqiured: true, default: false},
            caramel: {type: Boolean, reqiured: true, default: false}
        },
        preservativesAndAntioxidants: {
            sulphites: {type: Boolean, reqiured: true, default: false},
            suphurDioxide: {type: Boolean, reqiured: true, default: false},
            ethyleneOxide: {type: Boolean, reqiured: true, default: false},
            benzoates: {type: Boolean, reqiured: true, default: false},
            nitritesAndNitrates: {type: Boolean, reqiured: true, default: false},
            sorbates: {type: Boolean, reqiured: true, default: false},
            otherArtificialPreservatives: {type: Boolean, reqiured: true, default: false},
            bha: {type: Boolean, reqiured: true, default: false},
            bht: {type: Boolean, reqiured: true, default: false},
            otherAntioxidants: {type: Boolean, reqiured: true, default: false}
        },
        sugarsAndSweetners: {
            addedSugar: {type: Boolean, reqiured: true, default: false},
            aspartame: {type: Boolean, reqiured: true, default: false},
            otherArtificialSweetners: {type: Boolean, reqiured: true, default: false},
            dextrose: {type: Boolean, reqiured: true, default: false},
            fructose: {type: Boolean, reqiured: true, default: false},
            glucose: {type: Boolean, reqiured: true, default: false},
            polyols: {type: Boolean, reqiured: true, default: false},
            sucrose: {type: Boolean, reqiured: true, default: false},
            honey: {type: Boolean, reqiured: true, default: false}
        },
        respiratoryAllergies: { 
            hayFever: {type: Boolean, reqiured: true, default: false},
            asthma: {type: Boolean, reqiured: true, default: false},
            eczemaOrUrticaria: {type: Boolean, reqiured: true, default: false}
        },
        skinAllergies: {
            atopicEczema: {type: Boolean, reqiured: true, default: false},
            rubberLatex: {type: Boolean, reqiured: true, default: false},
            cosmetics: {type: Boolean, reqiured: true, default: false},
            hairDye: {type: Boolean, reqiured: true, default: false}
        },
        animalAndInsectAllergies: {
            dog: {type: Boolean, reqiured: true, default: false},
            cat: {type: Boolean, reqiured: true, default: false},
            insectStings: {type: Boolean, reqiured: true, default: false}
        },
        drugAllergies: {
            aspirinSalicylate: {type: Boolean, reqiured: true, default: false},
            penicillin: {type: Boolean, reqiured: true, default: false},
        },
        miscAllergies: {
            allergicConjunctivitisPinkEye: {type: Boolean, reqiured: true, default: false},
            poisonIvy: {type: Boolean, reqiured: true, default: false},
            poisonOak: {type: Boolean, reqiured: true, default: false},
            poisonSurmac: {type: Boolean, reqiured: true, default: false},
            dust: {type: Boolean, reqiured: true, default: false}
        },
        dieteryRequirments: {
            vegetarian: Boolean, 
            vegan: {type: Boolean, reqiured: true, default: false},
            diabetic: {type: Boolean, reqiured: true, default: false},
            kosher: {type: Boolean, reqiured: true, default: false},
            halal: {type: Boolean, reqiured: true, default: false},
            coeliacs: {type: Boolean, reqiured: true, default: false}
        }
    }
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

mongoose.connect('mongodb://localhost/Allershare');