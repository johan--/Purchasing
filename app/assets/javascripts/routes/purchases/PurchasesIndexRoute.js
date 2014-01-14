
App.PurchasesIndexRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams) {
    if (Ember.tryGet(transition, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs');
  }
});
