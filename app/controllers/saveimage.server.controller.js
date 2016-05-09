exports.render = function(req, res) {
	var success = false;
	if(req.session && req.session.user && req.session.access_token) {
		req.session.savedImages = (req.session.savedImages) ? req.session.savedImages : [];
		req.session.savedImages.push(req.body.image);
		success = true;
	}
	res.send(JSON.stringify({ 
		success: success
	}, null, 3));
}