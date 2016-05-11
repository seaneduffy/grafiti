var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	username: { type: String, required: true, unique: true , index: {unique: true}},
	images: [
		{src: {type: String, required: true}}
	]
});

var User = mongoose.model('User', userSchema);

module.exports = User;