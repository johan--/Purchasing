
$(function() {

  $('body').tooltip({
    animation: true,
    html: true,
    placement: 'auto top',
    delay: { show: 300, hide: 50 },
    selector: '[data-toggle="tooltip"]',
    container: 'body'
  });

});
