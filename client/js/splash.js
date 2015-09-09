/* global window*/

'use strict';

/*
window.$ = window.jQuery = require('jquery');
require('./jqModal.min');

$(window).load(function() {
    $('#modal').jqm({
      trigger: 'button#joinbutton'
    });

    if(window.location.hash && window.location.hash === '#join'){
      $('#modal').jqmShow()
    }

    $('#modal a').click(function() {
      $('#modal').jqmHide();
    });
});
*/

window.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
if (window.iOS) {
    // iOS doesn't support "background-attachment: fixed", and, in fact, does something weird, instead.
    //$('.fixed-background').removeClass('fixed-background');
    var backgroundElements = document.getElementsByClassName('fixed-background');
    while (backgroundElements.length)
        backgroundElements[0].classList.remove('fixed-background');
}
