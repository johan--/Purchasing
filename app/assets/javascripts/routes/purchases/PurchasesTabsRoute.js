
App.PurchasesTabsRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, query, transition) {
    console.log(params);
    console.log(query);
    console.log(transition);
    console.log('------------');

    var queryParams = Ember.tryGet(query, 'queryParams') || {};

    return this.get('store').find('purchase', queryParams);
  },


  renderTemplate: function() {
    this.render('purchases/purchases');
  },


  setupController: function(controller, model, queryParams) {
    console.log(model);
    console.log(queryParams);
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
