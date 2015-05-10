'use strict';

var expressSession = require('express-session');

var MongoStore = require('connect-mongo')(expressSession);

var Db = require('./../models/database');

var Config = require('./../config/index');

var sessionOptions = {
  secret: Config.SECRET || 'http://youtu.be/BwBK2xkjaSU',
  store: new MongoStore({ mongooseConnection: Db }),
  resave: false,
  saveUninitialized: true,
  cookie: {}
};

if (Config.NODE_ENV === 'production') {

  // Set secure cookies when app is in production
  // TODO: Uncomment
  // sessionOptions.cookie.secure = true;
}

var session = expressSession(sessionOptions);

module.exports = session;
