App.SmallDateInput = Ember.TextField.extend({
  classNames: ['datepicker_sm'],

  didInsertElement: function() {
    $(".datepicker_sm").datepicker({ dateFormat: 'M d' });
  }

});
