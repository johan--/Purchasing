
App.DatePickerInput = Ember.TextField.extend({
  classNames: ['form-control'],


  initDatepicker: function() {
    this.$().datepicker({
      format: APP_DATE_STRING_DATEBOX,
      autoclose: true,
      todayHighlight: true
    });
  }.on('didInsertElement'),


  destroyDatepicker: function() {
    this.$().datepicker('destroy');
  }.on('willDestroyElement'),


  keyDown: function() {
    this.$().datepicker('hide');
  }
});
