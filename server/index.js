'use strict';

var bodyParser = require('body-parser');
var express = require('express');

var app = express();

var Config = require('./config/index');
var SessionConfig = require('./config/session');
var NunjucksEnv = require('./config/nunjucks')(app);

var server = app.listen(Config.SERVER_PORT, Config.SERVER_ADDRESS, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Developers\' Guild Website listening at http://%s:%s in ' +
              '%s mode.', host, port, Config.NODE_ENV);

});

var io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(SessionConfig);

app.use(express.static('public'));

var routerIndex = require('./routes');

// Use the routers
app.use(routerIndex);

require('./events')(io);

// Handle 404 Error
app.use(function(req, res) {
  res.redirect('/');
});
