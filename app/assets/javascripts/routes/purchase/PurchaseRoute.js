App.PurchaseRoute = Ember.Route.extend({

  model: function(params, transition, queryParams) {
    return this.get('store').find('purchase', params.purchase_id);
  }
});
