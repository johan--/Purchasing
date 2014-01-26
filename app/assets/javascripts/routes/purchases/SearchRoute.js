App.SearchRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition, queryParams) {
    return this.get('store').findSearch(params, this);
  },


  renderTemplate: function() {
    this.render('search/index', {
      controller: 'search'
    });
  },


  metaName: function() {
    return 'search';
  }.property(),


  actions: {

    queryParamsDidChange: function() {
      this.refresh();
    }
  }
});
