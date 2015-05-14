'use strict';

var async     = require('async');
var express   = require('express');

var router = express.Router();

function handleIndexFetch(req, res) {
  res.render('index.html');
}

function handleSplashFetch(req, res) {

  // TEMP
  //req.session.splash = true;

  res.render('splash.html');
}

router.get('/', handleIndexFetch);
router.get('/splash', handleSplashFetch);

module.exports = router;
