var mongoose = require('mongoose');
var models = require('./../models');

mongoose.connect('mongodb://localhost/allerShare');
models.BaseUser.find({_type: 'Admin'}, function(err, data) {
	if (err) { console.log(err); }
	else if (data.length === 0) {
		console.log('No admin users currently exist');
	}
	else {
		for (var i=0; i < data.length; i++) {
			console.log(data[i]);
		}
	}
	process.exit();
});