
// Input for full FOAP, masked
App.FOAPMasketInput = Ember.TextField.extend({

  didInsertElement: function() {
    this.$().focus();
    this.$().mask('999999-999999-99999');
  },


  willDestroyElement: function() {
    this.$().unmask();
    this._super();
  }

});
