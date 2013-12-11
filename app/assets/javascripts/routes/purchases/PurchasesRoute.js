App.PurchasesRoute = Ember.Route.extend(App.PurchasesRouteMixin, {


  model: function(params, queryParams, transition) {
    return this.get('store').find('purchase', queryParams);
  },


  renderTemplate: function() {
    this.render('purchases/index');
  },


  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
    controller.set('queryParams', queryParams);

    controller.set('assigning', false);
    controller.set('reconciling', false);
  },

  actions: {

    tabClick: function(tab) {
      this.newPage({ tab: tab, purPage: 1 });
      return false;
    }
  }
});
