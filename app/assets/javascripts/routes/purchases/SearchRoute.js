App.SearchRoute = Ember.Route.extend(App.PurchasesRouteMixin, {

  model: function(params, transition, queryParams) {
    return this.store.findSearch(params, this);
  },


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('hoverDoc', null);
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
    this.render('search/index');
  },


  metaName: function() {
    return 'search';
  }.property(),


  deactivate: function() {
    this.get('controller').set('hoverDoc', null);
  },


  actions: {

    queryParamsDidChange: function() {
      this.refresh();
    },


    loading: function() {
      $('.main_spinner').show();
    }
  }
});
