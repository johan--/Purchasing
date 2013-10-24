App.PurchaseLineItemsController = Ember.ArrayController.extend({
  itemController: 'line_item',

  subTotal: function() {
    return this.get('extendedCost');
  }.property('@each.extendedCost')

});
