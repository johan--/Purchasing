App.PurchasesRoute = Ember.Route.extend({
  observesParameters: ['page', 'sort', 'direction', 'buyer', 'tab'],

  model: function() {
    return this.get('store').find('purchase', this.get('queryParameters'));
  }
});
