'use strict';

var bodyParser      = require('body-parser');
var express         = require('express');
var moment          = require('moment');
var nunjucks        = require('nunjucks');
var path            = require('path');
var expressSession  = require('express-session');

var MongoStore = require('connect-mongo')(expressSession);

// Use middleware
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router      = express.Router();
var routerForum = express.Router();

// Include database model
var Db = require('./models/database');

var User = require('./models/user');

var sessionOptions = {
  secret: process.env.SESS_SECRET || 'http://youtu.be/BwBK2xkjaSU',
  store: new MongoStore({ mongooseConnection: Db }),
  resave: false,
  saveUninitialized: true,
  cookie: {}
};

var SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'localhost';
var SERVER_PORT = process.env.SERVER_PORT || 3000;


if (app.get('env') === 'production') {

  // Set secure cookies when app is in production
  // sess.cookie.secure = true;
}

var session = expressSession(sessionOptions);

io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});

app.use(session);

// Tell Nunjucks where the templates are stored.
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'),
                                    { autoescape: false });
env.express(app);

env.addFilter('getUserAvatar', function(username, callback) {

  // got an error on the 'multi line' thread because username returns undefined
  if (username) {
    User.getAvatar(username, callback);
  }
}, true);

env.addFilter('getUserTitle', function(username, callback) {
  if (username) {
    User.getTitle(username, callback);
  }
}, true);

env.addFilter('getOnline', function(username, callback) {
  if (username) {
    User.getOnlineStatus(username, callback);
  }
}, true);

env.addFilter('convertTimestamp', function(timestamp) {
  return moment(timestamp).fromNow();
});

// Tell Express to serve static objects from the /public/ directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

  env.addGlobal('sessUser', req.session.user);

  next();
});

require('./routes/index')(router);
require('./routes/forum')(routerForum);
require('./routes/user')(routerForum, io);

require('./events/index')(io);

app.use(router);
app.use('/forum', routerForum);

// Put the forum require before the user because the app.all('*')
// is chained to all other requests
// require('./routes/forum')(app);
// require('./routes/user')(app);


// Handle 404 Error
app.use(function(req, res, next) {
  var templateVars = {
    title: 'Not Found',
    code: 404,
    sessUser: req.session.user
  };

  res.render('error.html', templateVars);
});



server.listen(SERVER_PORT, SERVER_ADDRESS, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Developers\' Guild Forum listening at http://%s:%s in %s mode.',
    host, port, app.get('env'));

});
