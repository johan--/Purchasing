
App.PriceInput = Ember.TextField.extend({

  focusOut: function() {
    this.$().formatCurrency();
  },

  didInsertElement: function() {
    this.$().formatCurrency();
  }
});
