'use strict';

var bodyParser  = require('body-parser');
var express     = require('express');

var app = express();

var Config      = require('./config/index');
var Session     = require('./config/session');
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

io.use(require('./app/socket-session'));

app.use(Session);

app.use(express.static('public'));
app.use(express.static('node_modules/animate.css'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));

app.use(require('./app/nunjucks')(app, NunjucksEnv));

var routerIndex = require('./routes/index');
var routerForum = require('./routes/forum');
var routerUser  = require('./routes/user')(io);

// Use the routers
app.use(routerIndex);
app.use('/forum', routerForum);
app.use('/forum', routerUser);

require('./events/index')(io);

// Handle 404 Error
app.use(require('./app/404'));
