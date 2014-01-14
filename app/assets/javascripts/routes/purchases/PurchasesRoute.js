
App.PurchasesRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams) {
    if (Ember.tryGet(transition, 'targetName') !== 'purchases.tabs')
      this.transitionTo('purchases.tabs', { queryParams: queryParams });
  },


  model: function(params, transition, queryParams) {
    return;
  },


  renderTemplate: function() {
    this.render('purchases/index');
  }
});
