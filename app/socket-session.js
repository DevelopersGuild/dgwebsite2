'use strict';

var session = require('./../config/session');

module.exports = function(socket, next) {
  session(socket.request, socket.request.res, next);
};
