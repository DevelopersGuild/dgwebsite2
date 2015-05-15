$(document).ready(function() {

var landingHeight = $('.landing').innerHeight();

$(document).scroll(function() {

    var scrollpos = $(this).scrollTop();

    if (scrollpos >= landingHeight) {
        $('.header-cont').addClass('enter-content');
    } else
        $('.header-cont').removeClass('enter-content');

    // to highlight panel names
    /*for (var i = 0; i < $('.header>.nav').length; i++) {
        if (scrollpos >= landingHeight * (i + 1) && scrollpos < landingHeight * (i + 2))
            $('.header>.nav#tab-' + i).addClass('current-tab');
        else $('.header>.nav#tab-' + i).removeClass('current-tab');
    }*/

    var panes = ['demo', 'controls', 'downloads'] // ID's
    panes.forEach(function(idsuffix) {
        var el = $('#' + idsuffix);
        if (scrollpos >= $(el).offset().top && scrollpos <  $(el).offset().top + $(el).outerHeight()) {
            $('.header>.nav#tab-' + idsuffix).addClass('current-tab');
        }
        else $('.header>.nav#tab-' + idsuffix).removeClass('current-tab');
    })

    if (scrollpos >= landingHeight && scrollpos < landingHeight * 2)
        $('section .info').addClass('rigid-pane');
    else
        $('section .info').removeClass('rigid-pane');

    // TODO: description area will probably be variable in content size. above for
    // loop to calculate scroll positions will not be maintainable for those.

})

});