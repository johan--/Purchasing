App.UsersRoute = Ember.Route.extend({


  model: function(params, transition, queryParams) {
    return this.get('store').find('user', params);
  },


  renderTemplate: function() {
    this.render('users/index');
  },


  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
  },


  actions: {

    queryParamsDidChange: function() {
      this.refresh();
    }
  }
});
