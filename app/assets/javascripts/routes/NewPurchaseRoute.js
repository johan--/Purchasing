App.NewPurchaseRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('purchase');
  },

  actions: {
    save: function() {
      this.modelFor('newPurchase').save();
    }
  }
});
