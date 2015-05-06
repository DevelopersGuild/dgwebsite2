/* global io */

'use strict';
var socket = io();

var users;
socket.on('onlineUsers', function(users) {

  $('#onlineUsers').empty();

  for (var user in users) {
    $('#onlineUsers').append($('<li>').text(user));
  }
});

socket.on('guestNum', function(num) {
  $('#onlineGuests').text('Guests Online: ' + num);
});
