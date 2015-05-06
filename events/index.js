'use strict';

var users = require('./../config/userlist');
var guests = require('./../config/guestlist');

// 30 mins
var TTL = 1800000;

module.exports = function(io) {

  io.on('connection', function(socket) {

    var session = socket.request.session;


    // if user is logged in
    if (session.user) {

      users[session.user.username] = {
        expiration: -1
      };

    } else if (session.guest) {

      // session.guest is a string id that's set in routes/index.js
      guests[session.guest] = {
        expiration: -1
      };

    }

    io.emit('onlineUsers', users);
    io.emit('guestNum', Object.keys(guests).length);

    socket.on('disconnect', function () {
      if (session.user) {
        if (users[session.user.username]) {
          users[session.user.username].expiration = Date.now() + TTL;
        }

      } else if (session.guest) {
        if (guests[session.guest]) {
          guests[session.guest].expiration = Date.now() + TTL;
        }

      }

    });

  });

  function checkOnline() {
    for (var user in users) {
      if (users[user].expiration !== -1 &&
          users[user].expiration < Date.now()) {

        delete users[user];

        io.emit('onlineUsers', users);
      }
    }

    for (var guest in guests) {
      if (guests[guest].expiration !== -1 &&
          guests[guest].expiration < Date.now()) {

        delete guests[guest];

        io.emit('guestNum', Object.keys(guests).length);
      }
    }
  }

  setInterval(checkOnline, 1000 * 60);


};
