console.log('routes.js loading...');

var path = require('path');

module.exports = function(expressApp) {
	expressApp.get('/', function(request, response) {
		response.render('home');
	});
}