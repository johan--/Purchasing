App.SearchRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition, queryParams) {
    return this.store.findSearch(params, this);
  },


  renderTemplate: function() {
    this.render('search/index');
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
