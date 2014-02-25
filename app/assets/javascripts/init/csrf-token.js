
$(function() {

  // Send CSRF token in all jquery requests
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });

});
