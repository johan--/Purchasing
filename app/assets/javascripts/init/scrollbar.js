
(function($){

$.scrollbarWidth = function() {
  one = document.body.scrollWidth;
  two = document.documentElement.scrollWidth;

  return (one > two) ? one : two ;
};

})(jQuery);
