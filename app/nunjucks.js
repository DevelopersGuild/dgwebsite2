'use strict';

var moment = require('moment');
var User = require('./../models/user');

module.exports = function(app, env) {
  return function(req, res, next) {

    // Filters

    env.addFilter('getUserAvatar', function(username, callback) {

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

    // Global Template Var
    env.addGlobal('sessUser', req.session.user);
    next();
  };
};
