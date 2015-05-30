$(document).ready(function() {

var landingHeight = $('.landing').innerHeight();

var panes = ['demo', 'controls', 'downloads', 'people']; // ID's
var activeNav;
panes.forEach(function(idsuffix) {

  $('section#' + idsuffix).waypoint(function(dir) {
    var activeNav = $(this);
    if (dir === 'down') {
      activeNav = $(this).next();
    }
    var sectionId = activeNav.attr('id');
    $('.header>.nav').removeClass('current-tab');
    $('.header>.nav#' + idsuffix ).addClass('current-tab');
  });

 /* $('#' + idsuffix).waypoint({
    handler: function() {
      console.log('passed offsetted', idsuffix);
      if ($(activeNav))
        $(activeNav).removeClass('current-tab');
      $('.header>.nav#tab-' + idsuffix).addClass('current-tab');
      activeNav = $('.header>.nav#tab-' + idsuffix);
    },
    offset: function() {
      return -$('#' + idsuffix).outerHeight();
    }
  })
*/
/*  var topWP = new Waypoint({
    element: document.getElementById(idsuffix),
    handler: function() {
      $('.header>.nav#tab-' + idsuffix).addClass('current-tab');

    }
  });
  var bottomWP = new Waypoint({
    element: document.getElementById(idsuffix),
    handler: function() {
      $('.header>.nav#tab-' + idsuffix).removeClass('current-tab');
      console.log(idsuffix, 'removed');
    },
    offset: function() {
      return -document.getElementById(idsuffix).clientHeight;
    }
  });*/
});

$(document).scroll(function() {

    var scrollpos = $(this).scrollTop();

    if (scrollpos >= landingHeight - 60) {
        $('.header-cont').addClass('enter-content');
    } else
        $('.header-cont').removeClass('enter-content');

});
});
