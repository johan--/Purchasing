
App.DateRangePicker = Ember.View.extend({
  classNames: ['input-daterange', 'date'],
  templateName: 'views/date_range_picker',

  initDatepicker: function() {
    this.$().datepicker({
      format: App.Globals.DATE_STRING_DATEBOX,
      autoclose: true,
      todayHighlight: true
    });
  }.on('didInsertElement'),


  destroyDatepicker: function() {
    this.$().datepicker('destroy');
  }.on('willDestroyElement'),

});
