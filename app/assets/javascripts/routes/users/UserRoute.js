App.UsersRoute = Ember.Route.extend({


  beforeModel: function(transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (App.current_user.get('is_buyer') !== true) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },


  model: function(params, transition, queryParams) {
    return this.store.find('user', params);
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
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
