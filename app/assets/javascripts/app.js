app = (function(){
  $(function() {

   $(document).on('click', null, function() {
      $('.navigation_items').fadeOut();
      $('.navigation_menu').removeClass('on');
    });

    $(document).on('click', '.navigation_menu', function() {
      menu = $('.navigation_items');
      if ( menu.css('display') == 'none' ) {
        menu.slideDown(200);
        $('.navigation_menu').addClass('on'); }
      else {
        menu.fadeOut(200);
        $('.navigation_menu').removeClass('on');
      }
      return false;
    });

    $(document).on('click', '.search_close_field', function() {
      $('.advanced_search_box').hide();
    });

    // Enable HTML in content  http://stackoverflow.com/questions/15734105/jquery-ui-tooltip-does-not-support-html-content
    $.widget("ui.tooltip", $.ui.tooltip, {
      options: {
        hide: false,
        show: {
          effect: 'fadeIn',
          delay: 500,
          duration: 100},
        position: {
          my: 'left top',
          at: 'left+120px bottom' },
        content: function () {
          return $(this).prop('title');
        }
      }
    });
    $(document).tooltip();

  });
})();
