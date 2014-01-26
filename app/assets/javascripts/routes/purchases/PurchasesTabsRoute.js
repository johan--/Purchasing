
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

    queryParamsDidChange: function(changed, all, removed) {
      var self = this;

      Ember.run.once(function(){
        // Reset page # if the tab changed
        if (!isEmpty(changed['purchases.tabs[tab]'])) {
          var tab = changed['purchases.tabs[tab]'];
          self.transitionTo('purchases.tabs', { queryParams: { purPage: 1, tab: tab } });
        }

        self.refresh();
      });
    },


    loading: function() {
      $('.main_spinner').show();
    }
  }
});
