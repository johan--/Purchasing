$(function() {
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
        at: 'left bottom' },
      content: function () {
        return $(this).prop('title');
      }
    }
  });
  $(document).tooltip();
});
