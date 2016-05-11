var path = require('path'),
	User = require('../models/user.server.model');

exports.render = function(req, res) {
	var success = false,
		sendResponse = function() {
			res.send(JSON.stringify({
				success: success
			}, null, 3));
		};
	
	if(req.session && req.session.user && req.session.access_token) {
		var img = req.body.image.replace(/^data:image\/png;base64,/, ""),
			filename = req.session.user.username + "-" + Date.now() + ".png",
			url = "/saved/" + filename;
			
		require("fs").writeFile(path.resolve('public/saved') + '/' + filename, img, 'base64', function(err) {
			if(err) {
				sendResponse();
			} else {
				User.findOne({'username': req.session.user.username}).exec().then(function(user){
					if(user) {
						success = true;
						user.images.push({src:url});
						user.save();
						sendResponse();
					} else {
						sendResponse();
					}
				}, function(err){
					sendResponse();
				});
			}
		});
	} else {
		sendResponse();
	}
}