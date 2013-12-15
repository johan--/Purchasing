
App.PurchasesRoute = Ember.Route.extend({

  model: function(params, queryParams, transition) {
    return;
  },

  renderTemplate: function() {
    this.render('purchases/index');
  }

});
