App.PurchasesRoute = Ember.Route.extend({
  observesParameters: ['page', 'sort', 'direction', 'buyer', 'tab'],

  model: function() {
    var store = this.get('store');
    return store.find('purchase', this.get('queryParameters'));
  }
});
