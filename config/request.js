'use strict';

var request = require('request');

module.exports = request.defaults({
  json: true,
  headers: {
    'User-Agent': 'developersguildbot',
    Authorization: 'token ' + process.env.CLIENT_TOKEN
  }
});
