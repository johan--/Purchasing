App.SearchRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, queryParams, transition) {
  },

  renderTemplate: function() {
    this.render('search/index', {
      controller: 'search'
    });
  },

  setupController: function(controller, model, queryParams) {
    // Setup model here so that the view will always load
    var model = this.get('store').findSearch(queryParams, this);

    controller.set('model', model);
    controller.set('queryParams', queryParams);
  }
});

