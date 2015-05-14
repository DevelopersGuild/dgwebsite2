'use strict';

var express = require('express');

var app = express();

var Config      = require('./config/index');
var NunjucksEnv = require('./config/nunjucks')(app);

var server = app.listen(Config.SERVER_PORT, Config.SERVER_ADDRESS, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Developers\' Guild Website listening at http://%s:%s in ' +
              '%s mode.', host, port, Config.NODE_ENV);

});

var io = require('socket.io')(server);

app.use(express.static('public'));
app.use(express.static('node_modules/animate.css'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));

var routerIndex = require('./routes');

// Use the routers
app.use(routerIndex);

require('./events/index')(io);

// Handle 404 Error
app.use(function(req, res) {
  res.redirect('/');
});
