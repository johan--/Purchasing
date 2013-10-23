App.LineItemController = Ember.ObjectController.extend({

  extendedCost: function() {
    var quantity = toNumber(this.get('quantity'));
    var price = toNumber(this.get('price'));
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),

});
