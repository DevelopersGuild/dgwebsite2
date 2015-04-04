$(document).ready(function() {

var slider = $('.project-gallery').lightSlider({
  autoWidth: false,
  item:5,
  pager:false
});

$('#left-arrow').click(function() {
  slider.goToPrevSlide();
});

$('#right-arrow').click(function() {
  slider.goToNextSlide();
});

});
