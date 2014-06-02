var mongoose = require('mongoose');
var models = require('./../models');

mongoose.connect('mongodb://localhost/allerShare');
var args = process.argv.splice(2);
if (args.length !== 3) {
	console.log('Usage: node createAdminUser <username> <password> <emailAddress>');
	process.exit();
}
else {
	var username = args[0];
	var password = args[1];
	var email = args[2];
	models.AdminUser.findOne({username: username}, function(err, data) {
		if (err) { 
			console.log(err); 
			process.exit();
		}
		else if (data) { 
			console.log('Username already exists'); 
			process.exit();
		}
		else {
			var adminUser = new models.AdminUser({username: username, password: password, email: email});
			adminUser.save(function(err, result) {
				err ? console.log(err) : console.log('Created admin user successfully');
				process.exit();
			});
		}
	});
}