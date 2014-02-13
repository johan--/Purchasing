
App.PurchasesTabsRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition) {
    return this.store.find('purchase', params);
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
    this.render('purchases/purchases');
  },


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('hoverDoc', null);
    controller.clearSelected();
  },


  deactivate: function() {
    this.get('controller').set('hoverDoc', null);
  },


  actions: {

    queryParamsDidChange: function() {
      this.refresh();
    },


    loading: function() {
      $('.main_spinner').show();
    }
  }
});
