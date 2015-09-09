'use strict';

var async     = require('async');
var express   = require('express');

var router = express.Router();

var GitHubConfig = require('../config/github');

var GitHub = require('../models/github');
var User = require('../models/user');

function handleIndexFetch(req, res) {
  res.render('index.html', { loginUrl: GitHubConfig.loginUrl });
}

function handleSplashFetch(req, res) {

  // TEMP
  //req.session.splash = true;

  res.render('splash.html');
}

function handleHubFetch(req, res) {
  res.render('hub.html', {
    carousel: require('../config/carousel')
  });
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
router.get('/hub', handleHubFetch);
router.get('/projects/:name', handleProjectPage);


router.get('/index', handleIndexFetch);
// Since 'login' is a reserved word in GitHub, this won't be an issue
router.get('/user/login', handleUserLogin);

module.exports = router;
