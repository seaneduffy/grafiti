module.exports = function(app) {
	var logout = require('../controllers/logout.server.controller');
	app.get('/logout', logout.render);
}