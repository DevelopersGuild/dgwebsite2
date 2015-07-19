/* global window*/

'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');
require('./jqModal.min');

$(window).load(function() {
    /*
    $('#modal').jqm({
      trigger: 'button#joinbutton'
    });

    if(window.location.hash && window.location.hash === '#join'){
      $('#modal').jqmShow()
    }

    $('#modal a').click(function() {
      $('#modal').jqmHide();
    });
*/
});

//go to top button function
$("#gotop").mouseenter(function(){
   $("#gotop").fadeTo("fast", 0.8);
});
$("#gotop").mouseleave(function(){
   $("#gotop").fadeTo("fast", 0.3);
});

$(window).scroll(function() {
  if (window.iOS) {
    return;
  }
  var windowHeight = window.innerHeight;
  if ($(this).scrollTop() > windowHeight){
    $('#gotop').fadeIn("fast");
  } else {
    $('#gotop').stop().fadeOut("fast");
  }
});

var windowHeight = window.innerHeight;
if ($(this).scrollTop() > windowHeight) {
  $('#gotop').show();
}

$("#gotop").click(function(){
    $("html, body").animate({ scrollTop: 0}, 1000);
});

// iOS detection from http://stackoverflow.com/questions/9038625/detect-if-device-is-ios
window.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
if (window.iOS) {
    // The go-to-top button looks goofy on iOS with our current CSS.
    $("#gotop").hide();

    // iOS doesn't support "background-attachment: fixed," and, in fact, does something weird, instead.
    $(".fixed-background").removeClass("fixed-background");
}


