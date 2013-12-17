
App.PurchasesIndexRoute = Ember.Route.extend({

  beforeModel: function(queryParams, transition) {
    if (Ember.tryGet(transition, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs');
  }
});
