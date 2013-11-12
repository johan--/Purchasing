App.SearchRoute = App.PurchasesRoute.extend({

  model: function(params, queryParams, transition) {
    return this.get('store').findSearch(queryParams);
  },

  renderTemplate: function() {
    this.render('search/index', {
      controller: 'search'
    });
  },

  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
    controller.set('queryParams', queryParams);
  },

});

