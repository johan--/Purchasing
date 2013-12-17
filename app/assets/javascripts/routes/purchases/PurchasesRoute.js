
App.PurchasesRoute = Ember.Route.extend({

  beforeModel: function(queryParams, transition) {
    if (Ember.tryGet(transition, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs', { queryParams: queryParams });
  },


  model: function(params, queryParams, transition) {
    return;
  },


  renderTemplate: function() {
    this.render('purchases/index');
  }
});
