
App.PurchasesTabsRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition) {
    return this.get('store').find('purchase', params);
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
    this.render('purchases/purchases');
  },


  setupController: function(controller, model) {
    controller.set('model', model);
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
