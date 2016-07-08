process.env.NODE_ENV = process.env.NODE_ENV 
	|| 'production';

var mongoose = require('./config/mongoose'),
	express = require('./config/express');
	
var db = mongoose();
var app = express();
app.listen(8008);
module.exports = app;

console.log('Server running at http://localhost:8008/');
