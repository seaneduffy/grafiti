exports.render = function(req, res) {
	var tempVars = {
		title: 'Grafiti',
		savedImages: []
	}
	
	if(req.session && req.session.user && req.session.access_token) {
		tempVars.user = req.session.user;
		tempVars.access_token = req.session.access_token;
		if(req.session.savedImages)
			tempVars.savedImages = req.session.savedImages;
	}
	
	res.render('index', tempVars);
}