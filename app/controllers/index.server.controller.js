var User = require('../models/user.server.model');

exports.render = function(req, res) {
	var tempVars = {
		title: 'Grafiti',
		savedImages: []
	}
	
	if(req.session && req.session.user && req.session.access_token) {
		tempVars.user = req.session.user;
		tempVars.access_token = req.session.access_token;
		
		User.findOne({'username': req.session.user.username}).exec().then(function(user){
			if(user) {
				tempVars.savedImages = user.images.map(function(img) {
					return img.src;
				});
			}
			res.render('index', tempVars);
		}, function(err) {
			res.render('index', tempVars);
		});
	} else {
		res.render('index', tempVars);
	}
}