
App.PurchasesRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams) {
    if (Ember.tryGet(queryParams, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs');
  },


  model: function(params, queryParams, transition) {
    return;
  },


  renderTemplate: function() {
    this.render('purchases/index');
  }
});
