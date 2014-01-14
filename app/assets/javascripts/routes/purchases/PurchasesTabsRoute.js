
App.PurchasesTabsRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition, queryParams) {
    console.log('0')
    console.log(transition)
    console.log(queryParams)

    return this.get('store').find('purchase');
  },


  renderTemplate: function() {
    console.log('1')
    this.render('purchases/purchases');
  },


  setupController: function(controller, model) {
    console.log('2')
    controller.set('model', model);
  },


  actions: {

    tabClick: function(tab) {
      this.newPage({ tab: tab, purPage: 1 });
      return false;
    }
  }
});
