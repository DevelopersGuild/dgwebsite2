'use strict';

module.exports = function(app) {

  var async = require('async');
  var validator = require('validator');

  var User = require('.././models/user');
  var Thread = require('.././models/thread');

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

    /*
    var page = validator.toInt(validator.escape(req.query.page)) || 1;

    // validation for page
    if ( (page < 1) || (page % 1 !== 0) ) {
      page = 1;
    }
    */


    var sectionGD = 0;
    var sectionIdeas = 1;
    var sectionNews = 2;

    // Page zero grabs only 5 threads
    var page = 0;

    async.parallel({
      threadsGD: function(next) {
        Thread.getAll(sectionGD, page, function(err, threads) {
          next(err, threads);
        });
      },
      threadsIdeas: function(next) {
        Thread.getAll(sectionIdeas, page, function(err, threads) {
          next(err, threads);
        });
      },
      threadsNews: function(next) {
        Thread.getAll(sectionNews, page, function(err, threads) {
          next(err, threads);
        });
      }
    },
    function(err, results) {
      if (err) {
        res.send(err);
        return;
      }

      User.getActiveUsers(function(onlineUsers) {

        var templateVars = {
          title: 'Index',
          threadsGD: results.threadsGD,
          threadsIdeas: results.threadsIdeas,
          threadsNews: results.threadsNews,
          // page: page,
          // lastPage: lastPage,
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

