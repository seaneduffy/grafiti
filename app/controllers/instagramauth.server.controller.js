var config = require('../../config/config');

exports.render = function(req, res) {
	res.redirect('https://api.instagram.com/oauth/authorize/?client_id=' + 
		config.instagramClientID + '&redirect_uri=' + encodeURI(config.instagramRedirectURI) + '&response_type=code');
}