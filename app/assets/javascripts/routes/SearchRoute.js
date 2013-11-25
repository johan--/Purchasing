App.SearchRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, queryParams, transition) {
    return this.get('store').findSearch(queryParams, this);
  },

  renderTemplate: function() {
    this.render('search/index', {
      controller: 'search'
    });
  },

  setupController: function(controller, model, queryParams) {
    // Setup model here so that the view will always load
    controller.set('model', model);
    controller.set('queryParams', queryParams);
  },

  metaName: function() {
    return 'search';
  }.property(),

  actions: {
    page: function(page) {
      this.newPage({ searchPage: page });
      return false;
    },

    willTransition: function(transition) {
      // Stop transition, clear it's query params, and retry
      /*
      if (!Ember.isEmpty(transition.queryParams)) {
        transition.abort();
        transition.queryParams = null;
        transition.retry();
      } */

      return true;
    }
  },

  cleanParams: function(params) {

  }
});

