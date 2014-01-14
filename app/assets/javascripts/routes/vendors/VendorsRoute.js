App.VendorsRoute = Ember.Route.extend({


  model: function(params, transition, queryParams) {
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
        this.newPage({ letter: letter, vendPage: 1 });
    },


    startSearch: function(vendSearch) {
      this.newPage({ vendSearch: vendSearch, vendPage: 1, letter: 'All' });
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
        vendSearch = params.vendSearch || null,
        letter = params.letter || metadata.letter || null;

    this.transitionTo({ queryParams: { vendPage: vendPage, vendSearch: vendSearch, letter: letter } });
  }
});
