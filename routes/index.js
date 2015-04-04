'use strict';

module.exports = function(app) {
  var User = require('.././models/user');
  var Thread = require('.././models/thread');
  var validator = require('validator');

  function handleOnEveryRequest(req, res, next) {

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
  }

  function handleIndexFetch(req, res, next) {

    var page = validator.toInt(validator.escape(req.query.page)) || 1;

    // (TEMP)
    var section = 0;
    // validation for page
    if ( (page < 1) || (page % 1 !== 0) ) {
      page = 1;
    }

    // Grab all threads.
    Thread.getAll(section, page, function(err, threads, lastPage) {

      if (err) {
        res.send(err);
        return;
      }

      // If user is on a page with no threads, redirect them to index
      if ((page !== 1) && (page > lastPage)) {
        res.redirect('/');
        return;
      }

      User.getActiveUsers(function(docs) {
        var onlineUsers = docs;

        var templateVars = {
          title: 'Index',
          threads: threads,
          page: page,
          lastPage: lastPage,
          onlineUsers: onlineUsers
        };

        // Render template
        res.render('index.html', templateVars);

      });
    });
  }

  function handleGetAllMembers(req, res) {

    User.getAllMembers(function(docs){

      if (docs) {

        var templateVars = {
          title: 'Members List',
          members: docs
        };

        res.render('membersList.html', templateVars);
      }

    });

  }

  app.all('*', handleOnEveryRequest);
  app.get('/', handleIndexFetch);
  app.get('/members', handleGetAllMembers);
};

