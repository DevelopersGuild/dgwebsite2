/* global window*/

'use strict';

/*
require('./jqModal.min');

$(window).load(function() {
    $('#modal').jqm({
      trigger: 'a#joinbutton'
    });

    if(window.location.hash && window.location.hash === '#join'){
      $('#modal').jqmShow()
    }

    $('#modal a').click(function() {
      $('#modal').jqmHide();
    });
});
*/

window.$ = window.jQuery = require('jquery');
require('./owl.carousel.min.js');

$(document).ready(function() {
  var $owl = $("#owl-slider");
  $owl.owlCarousel({
    items : 4,
    itemsDesktop : [1199,3],
    itemsDesktopSmall : [979,3],
  });

  $(".next").click(function() {
    $owl.trigger('owl.next');
  });

  $(".prev").click(function() {
    $owl.trigger('owl.prev');
  });

});


window.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
if (window.iOS) {
    // iOS doesn't support "background-attachment: fixed", and, in fact, does something weird, instead.
    //$('.fixed-background').removeClass('fixed-background');
    var backgroundElements = document.getElementsByClassName('fixed-background');
    while (backgroundElements.length)
        backgroundElements[0].classList.remove('fixed-background');
}
