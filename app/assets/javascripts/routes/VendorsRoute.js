App.VendorsRoute = Ember.Route.extend({

  model: function(params, queryParams, transition) {
    return this.get('store').find('vendor', queryParams);
  },

  renderTemplate: function() {
    this.render('vendors/index');
  },

  setupController: function(controller, model, queryParams) {
    controller.set('queryParams', queryParams);
    controller.set('model', model);
  },

  actions: {
    letterClick: function(letter) {
      letter = letter || 'All';
      if (letter != this.currentLetter)
        this.newPage({ letter: letter, vendPage: 1 })
    },

    startSearch: function(search) {
      this.newPage({ search: search, vendPage: 1, letter: 'All' });
    },

    page: function(page) {
      this.newPage({ vendPage: page });
    }
  },

  newPage: function(params) {
    var queryParams = this.get('controller.queryParams'),
        metadata = this.get('controller.metadata');

    params = params || {};
    var vendPage = params.vendPage || metadata.vendPage || 1,
        search = params.search || null,
        letter = params.letter || metadata.letter || null;

    this.transitionTo({ queryParams: { vendPage: vendPage, search: search, letter: letter } });
  }

});
