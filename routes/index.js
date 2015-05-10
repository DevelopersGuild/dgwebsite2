'use strict';

module.exports = function(app) {

  var async     = require('async');
  var shortid   = require('shortid');
  var validator = require('validator');

  var User  = require('.././models/user');
  var Thread = require('.././models/thread');

  function handleOnEveryRequest(req, res, next) {

    if (!req.session.guest) {

      // Give the new guest a quick and dirty id
      req.session.guest = shortid.generate();
    }

    next();
  }

  function handleIndexFetch(req, res) {

    /*
    var page = validator.toInt(validator.escape(req.query.page)) || 1;

    // validation for page
    if ( (page < 1) || (page % 1 !== 0) ) {
      page = 1;
    }
    */

    /*

    if (!req.session.splash) {

      res.redirect('/splash');

      return;
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

  function handleSplashFetch(req, res) {

    // TEMP
    //req.session.splash = true;

    res.render('splash.html');
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
  app.get('/splash', handleSplashFetch);
  app.get('/members', handleGetAllMembers);
};

