module.exports = function(app) {
	var index = require('../controllers/instagramauth.server.controller');
	app.get('/instagram', index.render);
}