App.UsersRoute = Ember.Route.extend({

  model: function(params, queryParams, transition) {
    return this.get('store').find('user', queryParams);
  },

  renderTemplate: function() {
    this.render('users/index');
  },

  setupController: function(controller, model, queryParams) {
    controller.set('queryParams', queryParams);
    controller.set('model', model);
  },

  actions: {
    startSearch: function(search) {
      this.newPage({ search: search, userPage: 1 });
    },

    page: function(page) {
      this.newPage({ userPage: page });
    }
  },

  newPage: function(params) {
    var queryParams = this.get('controller.queryParams'),
        metadata = this.get('controller.metadata');

    params = params || {};
    var userPage = params.userPage || metadata.userPage || 1,
        search = params.search || null;

    this.transitionTo({ queryParams: { userPage: userPage, search: search } });
  }

});
