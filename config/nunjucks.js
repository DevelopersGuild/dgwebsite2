'use strict';

var nunjucks = require('nunjucks');

module.exports = function(app) {

  var env = new nunjucks.Environment(

    // Tell Nunjucks where the templates are stored.
    new nunjucks.FileSystemLoader('views'),
    { autoescape: true }
  );

  env.express(app);

  return env;
};
