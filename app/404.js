'use strict';

module.exports = function(req, res) {
  var templateVars = {
    title: 'Not Found',
    code: 404
  };

  res.render('error.html', templateVars);
};
