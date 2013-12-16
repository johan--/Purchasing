
App.PurchasesIndexRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams) {
    if (queryParams.targetName !== 'purchases.tabs')
      this.transitionTo('purchases.tabs');
  },
});
