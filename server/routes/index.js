'use strict';

var async     = require('async');
var express   = require('express');

var router = express.Router();

/* Require mongo but not finished... reenable once used */
//var GitHubConfig = require('../config/github');
//var GitHub = require('../models/github');
//var User = require('../models/user');

function handleIndexFetch(req, res) {
  res.render('index.html', { loginUrl: GitHubConfig.loginUrl });
}

function handleSplashFetch(req, res) {

  // TEMP
  //req.session.splash = true;

  res.render('splash.html', {
    projects: require('../config/projects')
  });
}

function handleHubFetch(req, res) {
  res.render('hub.html', {
    carousel: require('../config/carousel')
  });
}

function handleJoin(req, res) {
  res.redirect('http://eepurl.com/boktMz');
}

function handleProjectPage(req, res, next) {
  var project = req.params.name;
  try {
    var projectDetails = require('../config/projects/' + project);
    res.render('projects/base.html', projectDetails);
  } catch (_) {
    next();
  }
}

function handleUserLogin(req, res) {
  var code = req.query.code;

  if (!code) {
    res.redirect('/');
    return;
  }

  GitHub.authenticateUser(code, function(err, token) {
    if (err) {
      console.error(err);
      res.send('Something went wrong with the server.');
      // TODO: Handle this error
    } else {

      // console.log(body);
      User.authenticate(token, function(err, user) {
        if (err) {
          console.error(err);
          res.send('Something went wrong with the server.');
        } else {
          res.send('Success!');
          // TOOD: Do this
          // req.session.user = user
        }
      });
    }
  });

}

router.get('/', handleSplashFetch);
//router.get('/hub', handleHubFetch);

//router.get('/index', handleIndexFetch);
// Since 'login' is a reserved word in GitHub, this won't be an issue
//router.get('/user/login', handleUserLogin);

router.get('/join', handleJoin)
router.get('/git', function(req, res) {
  res.render('git.html');
});

router.get('/calendar', function(req, res) {
  res.redirect('https://calendar.google.com/calendar/embed?src=deanzadevelopersguild%40gmail.com');
});

// Anything else we assume might be a project.
router.get('/:name', handleProjectPage);

module.exports = router;
