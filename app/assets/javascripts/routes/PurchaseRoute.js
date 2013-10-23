App.PurchaseRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('purchase', params.purchase_id);
  }
});
