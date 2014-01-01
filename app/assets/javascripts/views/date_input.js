
App.DateInput = Ember.View.extend({
  classNames: ['input-append', 'date'],
  templateName: 'views/date_picker',

  initDatepicker: function() {
    this.$('input').datepicker({
      format: APP_DATE_STRING_DATEBOX,
      autoclose: true,
      todayHighlight: true
    });
  }.on('didInsertElement'),


  destroyDatepicker: function() {
    this.$('input').datepicker('destroy');
  }.on('willDestroyElement'),

});



