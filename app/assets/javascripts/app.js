
$(function() {
  $('body').tooltip({
    animation: true,
    html: true,
    placement: 'auto bottom',
    delay: { show: 300, hide: 50 },
    selector: '[data-toggle="tooltip"]',
    container: 'body'
  });

  // Cleanup any hung tooltips
  $('body').on('click', function() {
    $('.tooltip').remove();
  });

  // Send CSRF token in all jquery requests
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });
});
