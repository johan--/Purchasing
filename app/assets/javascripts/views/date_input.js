
App.DateInput = Ember.TextField.extend({
  classNames: ['datepicker', 'md_input', 'form-control'],


  didInsertElement: function() {
    $(".datepicker").datepicker({ dateFormat: APP_DATE_STRING_DATEBOX });
  }
});
