exports.render = function(req, res) {
	req.session.destroy();
	res.redirect("/");
}