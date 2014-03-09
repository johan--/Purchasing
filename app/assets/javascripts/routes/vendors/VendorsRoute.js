
App.VendorsRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (App.Session.currentUser.get('is_buyer') !== true) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },


  model: function(params, transition, queryParams) {
    return this.store.find('vendor', params);
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
    this.render('vendors/index');
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
