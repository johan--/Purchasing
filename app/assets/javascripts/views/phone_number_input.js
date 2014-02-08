
App.PhoneNumberInput = Ember.TextField.extend({


  didInsertElement: function() {
    this.$().mask("(999) 999-9999");
  },


  willDestroyElement: function() {
    this.$().unmask();
    this._super();
  }
});
