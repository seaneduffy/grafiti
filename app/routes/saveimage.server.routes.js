module.exports = function(app) {
	app.post('/save', require('../controllers/saveimage.server.controller').render);
}