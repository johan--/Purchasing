App.PurchasesRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    return store.findAll('purchase')
  }
});
