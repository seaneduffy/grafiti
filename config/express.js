var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('cookie-session');
	
module.exports = function() {
	var app = express();
	
	if(process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if(process.env.NODE_ENV === 'production') {
		app.use(compress());
	}
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(methodOverride());
	
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));
	
	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	
	require('../app/routes/index.server.routes')(app);
	require('../app/routes/instagramredirect.server.routes')(app);
	require('../app/routes/instagramauth.server.routes')(app);
	require('../app/routes/logout.server.routes')(app);
	require('../app/routes/saveimage.server.routes')(app);
	
	app.use(express.static('./public'));
	
	return app;
};