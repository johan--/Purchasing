
App.DateInput = Ember.TextField.extend({
  classNames: ['datepicker', 'md_input'],

  didInsertElement: function() {
    $(".datepicker").datepicker({ dateFormat: 'M d, yy' });
  }

});
