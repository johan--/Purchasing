
App.PriceInput = Ember.TextField.extend({
  classNames: ['price_field'],

  eventManager: Ember.Object.create({

    focusOut: function(a, b) {
      // TODO Hacky way until I find something better
      $('.price_field').formatCurrency();
    }

  }),

  didInsertElement: function() {
    $('.price_field').formatCurrency();
  }
});
