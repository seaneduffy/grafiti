exports.render = function(req, res) {
	req.session = null;
	res.redirect("/");
}