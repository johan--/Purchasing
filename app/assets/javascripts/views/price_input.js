
App.PriceInput = Ember.TextField.extend({

  classNames: ['form-control'],

  focusOut: function() {
    this.$().formatCurrency();
  },


  didInsertElement: function() {
    this.$().formatCurrency();
  }
});
