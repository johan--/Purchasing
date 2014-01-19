
$(function() {
  $('body').tooltip({
    animation: true,
    html: true,
    placement: 'auto bottom',
    delay: { show: 300, hide: 50 },
    selector: '[data-toggle="tooltip"]',
    container: 'body'
  });

  // Send CSRF token in all jquery requests
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });
});

// Globals
(function(){
  App.Globals = {
    DATE_STRING: 'MMM D, YY',
    DATE_STRING_DATEBOX: 'M d, yyyy'
  };
})();
