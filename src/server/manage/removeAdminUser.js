var mongoose = require('mongoose');
var models = require('./../models');

mongoose.connect('mongodb://localhost/allerShare');
var args = process.argv.splice(2);
if (args.length !== 1) {
	console.log('Usage: node removeAdminUser <username>');
	process.exit();
}
else {
	var username = args[0];
	models.AdminUser.findOneAndRemove({username: username}, function(err, result) {
		err ? console.log(err) : 
		result ? console.log('Admin user removed successfully') : 
		console.log('Admin user does not exist');
		process.exit();
	});
}