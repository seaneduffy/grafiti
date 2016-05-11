var https = require('https'),
	querystring = require('querystring')
	config = require('../../config/config'),
	User = require('../models/user.server.model');

exports.render = function(req, res) {
	var data = querystring.stringify({
		'client_id' : config.instagramClientID,
		'client_secret': config.instagramClientSecret,
		'grant_type' : 'authorization_code',
		'redirect_uri' : config.instagramRedirectURI,
		'code' : req.query.code,
		'scope' : 'public_content'
	});
	var options = {
		host: 'api.instagram.com',
	    port: config.instagramPort,
	    method: "POST",
	    path: "/oauth/access_token",
	    headers: {}
	}
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = data.length;
		
	var httpsReq = https.request(options, function(httpsRes) {
        var body = '';
        httpsRes.setEncoding('utf8');

        httpsRes.on('data', function(chunk) {
          body += chunk;
        });

        httpsRes.on('end', function() {
			var result;
			try {
				result = JSON.parse(body);
				req.session.user = result.user;
				req.session.access_token = result.access_token;
				User.findOne({'username': result.user.username}).exec().then(function(user){
					if(user) {
						req.session.savedImages = user.images.map(function(image) {
							return image.src;
						});
					} else {
						var newUser = new User({
							username: result.user.username
						});
						newUser.save(function(err) {
							/*if(err) {
								console.log(err);
							} else {
								console.log("saved user");
							}*/
						});
					}
					res.redirect('/');
				}, function(err){
					res.redirect('/');
				});
			} catch(err) {
				req.session.error = "Error authentication with Instagram";
			}
			
        });
	});
	
	httpsReq.write(data);
	
	httpsReq.on('error', (e) => {
		req.session.error = "Error authentication with Instagram";
		res.redirect('/');
	});
	httpsReq.end();
}