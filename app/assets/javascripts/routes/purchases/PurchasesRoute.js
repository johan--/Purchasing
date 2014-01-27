
App.PurchasesRoute = Ember.Route.extend({

  beforeModel: function(transition) {
    if (Ember.tryGet(transition, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs');
  },


  model: function(params, transition, queryParams) {
    return;
  },


  renderTemplate: function() {
    this.render('purchases/index');
  }
});
