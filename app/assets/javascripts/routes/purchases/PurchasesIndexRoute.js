
App.PurchasesIndexRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams) {
    if (Ember.tryGet(queryParams, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs');
  },
});
