app = (function(){
  $(function() {

   $(document).on('click', null, function() {
      $('.navigation_items').fadeOut();
      $('.navigation_menu').removeClass('on');
      //$("#flash_parent").fadeOut();
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
    
    // Message close
    $('body').on('click', '.close_obj', function() {
      $(this).parent().fadeOut().remove();
    });

    // BG Modal
    $('body').on('click', '.background_modal, .animated_div', function() { close_modal() });

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

  var animating = false;
  var saved_div = null;
  var new_class = "edit_container";
  var div_check_timer = null;

  function start_animation(class_name){
    close_modal();
    saved_div = null;
    if (animating)
      return; // Or should this replace pending animation with current one?

    new_class = class_name;
    animating = true;
    animated_div = $('<div/>').attr('class', class_name);
    $('body').append(animated_div);
    max_top = animated_div.offset().top;
    max_left = animated_div.offset().left;
    max_height = animated_div.height();
    max_width = animated_div.width();

    animated_div.attr('class', 'animated_div');
    animated_div.offset({ top: window.innerHeight/2, left: window.innerWidth/2})
    animated_div.width(0).height(0);

    animated_div.animate({
      height: max_height,
      width: max_width,
      top: max_top,
      left: max_left}, 400, function(){ stop_animation(); }
    );
  }

  function stop_animation(){
    if (saved_div!= null) {
      $('.animated_div').remove();
      animating = false;
      show_div();
    } else {
      div_check_timer = setTimeout(stop_animation, 500);
    }
  }

  function save_div(div) {
    saved_div = div;
    if (!animating)
      show_div();
  }

  function show_div() {
    bg = $('<div/>').attr('class', 'background_modal')
    menu = $('<div/>').attr('class', 'modal_container').html(saved_div);
    $('body').append(bg);
    $('body').append(menu);
  }

  function close_modal() {
    clearInterval(div_check_timer);
    $('.animated_div').remove();
    $('.background_modal').remove();
    $('.modal_container').remove();
    $('[class^=token]').remove();
    $('[id^=ui-datepicker]').remove();
  }

  return {
    close_modal: function(){ close_modal(); },
    save_div: function(div){ save_div(div); },
    get_div: function(){ this.saved_data; },
    start_animation: function(class_name){ start_animation(class_name); }
  }
})();
