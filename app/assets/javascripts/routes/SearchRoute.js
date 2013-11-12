App.SearchRoute = App.PurchasesRoute.extend({

  model: function(params, queryParams, transition) {
    this.get('store').findSearch(queryParams, this);
  },

  renderTemplate: function() {
    this.render('search/index', {
      controller: 'search'
    });
  },

  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
    controller.set('queryParams', queryParams);
  }
});

