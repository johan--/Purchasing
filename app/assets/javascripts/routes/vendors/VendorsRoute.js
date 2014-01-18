App.VendorsRoute = Ember.Route.extend({


  model: function(params, transition, queryParams) {
    return this.get('store').find('vendor', params);
  },


  renderTemplate: function() {
    this.render('vendors/index');
  },


  setupController: function(controller, model) {
    controller.set('model', model);
  },


  deactivate: function() {
    console.log(this)
  },

  actions: {

    queryParamsDidChange: function() {
      this.refresh();
    }
  }
});
