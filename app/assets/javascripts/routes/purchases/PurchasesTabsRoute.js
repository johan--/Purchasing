
App.PurchasesTabsRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition) {
    return this.get('store').find('purchase', params);
  },


  renderTemplate: function() {
    this.render('purchases/purchases');
  },


  setupController: function(controller, model) {
    controller.set('model', model);
  },

  actions: {

    queryParamsDidChange: function() {
      this.refresh();
    }
  }
});
