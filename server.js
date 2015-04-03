'use strict';

var bodyParser    = require('body-parser');
var express       = require('express');
var nunjucks      = require('nunjucks');
var path          = require('path');
var session       = require('express-session');

var MongoStore = require('connect-mongo')(session);

// Use middleware
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Include database model
var Db = require('./models/database');

var User = require('./models/user');

var sess = {
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


app.use(session(sess));

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

// Tell Express to serve static objects from the /public/ directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

  env.addGlobal('sessUser', req.session.user);

  next();
});

// Put the forum require before the user because the app.all('*')
// is chained to all other requests
//require('./routes/forum')(app);
//require('./routes/user')(app);

/*
// Handle 404 Error
app.use(function(req, res, next) {
  var templateVars = {
    code: 404,
    message: 'Not Found',
    sessUser: req.session.user
  };

  res.render('error.html', templateVars);
});
*/


var server = app.listen(SERVER_PORT, SERVER_ADDRESS, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Developers\' Guild Forum listening at http://%s:%s in %s mode.',
    host, port, app.get('env'));

});
