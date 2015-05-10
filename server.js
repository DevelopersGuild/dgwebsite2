'use strict';

var bodyParser  = require('body-parser');
var express     = require('express');

var app = express();

var Config = require('./config/index');


var Session = require('./config/session');
var NunjucksEnv = require('./config/nunjucks')(app);

var router      = express.Router();
var routerForum = express.Router();

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

// Tell Express to serve static objects from the /public/ directory
app.use(express.static('public'));

app.use(require('./app/nunjucks')(app, NunjucksEnv));

require('./routes/index')(router);
require('./routes/forum')(routerForum);
require('./routes/user')(routerForum, io);

require('./events/index')(io);

// Use the routers
app.use(router);
app.use('/forum', routerForum);

// Handle 404 Error
app.use(require('./app/404'));
