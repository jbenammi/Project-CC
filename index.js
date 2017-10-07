
var fs = require('fs');
var express = require('express');
var expressApp = express();
var path = require('path');
var bodyParser = require('body-parser');

var environment = process.env.NODE_ENV;
console.log('environment: ', environment)

var expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(express.static(path.join(__dirname, 'client')));
expressApp.use(express.static(path.join(__dirname, 'client/assets')));
expressApp.set('views', path.join(__dirname, 'client/views'));
expressApp.set('view engine', 'ejs');


var routes = require('./server/config/routes.js')(expressApp);



var port = 6789
expressApp.listen(port, function(){
    console.log("listening on port "+ port);
})