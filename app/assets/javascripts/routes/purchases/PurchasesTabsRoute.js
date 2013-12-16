
App.PurchasesTabsRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, query, transition) {
    var queryParams = (query) ? query.queryParams || {} : {};

    return this.get('store').find('purchase', queryParams);
  },


  renderTemplate: function() {
    this.render('purchases/purchases');
  },


  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
    controller.set('queryParams', queryParams);
  },

  actions: {

    tabClick: function(tab) {
      this.newPage({ tab: tab, purPage: 1 });
      return false;
    }
  }
});
