'use strict';

module.exports = function(app) {
  var User = require('.././models/user');

  var handleOnEveryRequest = function(req, res, next) {

    // TODO: Check if request is logout
    if (req.session.user) {
      User.updateActivity(req.session.user.username, function(err) {
        if (err) {
          console.error(err);
        }
      });

      // Refresh the user's session expiration date if they view the forums
      // so that active users can continuously use the forums
      // 1 week
      var week = 1000 * 60 * 60 * 24 * 7;

      // Set the session to expire in a week
      req.session.cookie.expires = new Date(Date.now() + week);
    }

    next();
  };

  function handleIndexFetch(req, res, next) {
    var templateVars = {
      title: 'Index'
    };
    res.render('index.html', templateVars);
  }

  var handleGetAllMembers = function(req, res){

    User.getAllMembers(function(docs){

      if(docs){

        var templateVars = {
          title: 'Members List',
          members: docs
        };

        res.render('membersList.html', templateVars);
      }

    });

  };

  app.all('*', handleOnEveryRequest);
  app.get('/', handleIndexFetch);
  app.get('/members', handleGetAllMembers);
};

