
App.PhoneNumberInput = Ember.TextField.extend({


  didInsertElement: function() {
    this.$().mask("(999) 999-9999");
  }
});
