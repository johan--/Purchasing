
App.DateInput = Ember.TextField.extend({
  classNames: ['datepicker', 'md_input', 'form-control'],


  initDatepicker: function() {
    this.$().datepicker({ dateFormat: APP_DATE_STRING_DATEBOX });
  }.on('didInsertElement'),


  destroyDatepicker: function() {
    this.$().datepicker('destroy');
  }.on('willDestroyElement'),

});



