vendors = (function(){
  delayed_search = null;
  
  $(function(){

    $('.vendor_search').observe(1000, function(){
      refresh( $(this).serialize());
    });

    $('body').on('click', '.vendor_pagination>.pagination>.active', function() {
      $(this).removeClass('active');
      refresh_page($(this).data('page'));

      return false;
    });

    $('body').on('click', '.vendor>.content', function(){
      id = $(this).parent().attr('id');
      url = '/vendors/' + id + '/edit';
      app.start_animation('vendor_edit_box');
      $.get(url, null, null, 'script');
    });
  });
  
  function refresh(data) {
    $('.searching_bar').removeClass('hidden');
    $.ajaxSettings.accepts.html = $.ajaxSettings.accepts.script;
    $.ajax({
      url: '/vendors',
      data: data,
      dataType: 'html',
      success: function(data) {
        $('.searching_bar').addClass('hidden');
        $('content').html(data);
      }
    });
  }

  function refresh_page(page){
    page = page || $('#current_page', '.pages').data('page') || 1;
    current_letter = $('#current_letter', '.pages').data('letter') || 'all';
    refresh('page=' + page + '&letter=' + current_letter);
  }

  return {
    destroy: function(id){
      row = $('.vendor[id=' + id + ']');
      row.fadeOut('slow', function() { $(this).remove(); });
      refresh_page();
    },
    refresh_page: function(){ refresh_page(); }
  }
})();