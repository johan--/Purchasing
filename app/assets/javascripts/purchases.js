purchases = (function(){

  current_sort_field = "Date";
  current_order = "desc";
  current_page = 1; // TODO SET THIS ON LOAD
  current_user = 0;
  current_tab = 'On-route';

  $(function() {

    $('body').on('click', '.tab', function() {
      $('.tab.clicked').attr('class', 'tab');
      $(this).attr('class', 'tab clicked');
      current_tab = $(this).data('tab');
      refresh_list();
    });

    $('body').on('click', '.bar', function() {
      url = "/purchases/" + $(this).parent().data('id') + "/edit";
      app.start_animation('edit_box');
      $.get(url, null, null, 'script');
    });

    $('body').on('change', '#filter_by_user', function() {
      filter_records_by_user( $('#filter_by_user').val() );
    });

    $('body').on('click', '.header_sort', function() {
      sort_records_by_field( $(this).text().trim() );
    });

    $('body').on('click', '.purchase_pagination>.pagination>.active', function() {
      $(this).removeClass('active');
      current_page = $(this).data('page');
      refresh_list();
      return false;
    });

    $('body').on('click', '.star', function() {
      id = $(this).attr('id');
      starred = !($(this).data('star') || false);

      $(this).data('star', starred);
      if (starred)
        $(this).addClass('on');
      else
        $(this).removeClass('on');

      $.post("/purchases/star/" + id + "?star=" + starred, null, null, "script");

      return false;
    });

    $('body').on('click', '.checkbox', function() {
      box = $('#check', this);
      box.prop('checked') ? box.prop('checked', false) : box.prop('checked', true);
    });

    $('body').on('submit', '#quick_find', function() {
      if ($('#quick_find_text').val().length == 0) {
        alert("Please enter something to search for first");
        return false;
      }
    })
  });

  function filter_records_by_user(user) {
    current_user = user;
    refresh_list();
  }

  function sort_records_by_field(field) {
    if ( current_sort_field === field ) {
      order = (current_order === "asc") ? "desc" : "asc"; // Toggle order
      current_order = order;
    } else {
      order = "desc";
    }
    current_sort_field = field;
    refresh_list("&sort=" + field + "-" + order);
  }
  
  function refresh_list(options, clear_flash) {
    clear_flash = clear_flash || false;
    options = options || "";
    $.get("/purchases?buyer=" + current_user + "&page=" + current_page + "&flash=" + clear_flash + "&tab=" + current_tab + options, null, null, "script");
  }

  function set_vars(user, page) {
    current_user = user;
    current_page = page;
  }

  return {
    refresh_list: function(options, clear){ refresh_list(options, clear); },
    set_current_vars: function(user, page){ set_vars(user, page); },
    destroy: function(id){
      row = $('.row[data-id=' + id + ']');
      row.slideUp('slow', function() { $(this).remove(); });}
    }
})();