module.exports = function(app) {
	var page = require('../controllers/instagramredirect.server.controller');
	app.get('/redirect', page.render);
}