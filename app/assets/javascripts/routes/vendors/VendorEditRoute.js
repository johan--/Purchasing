
App.VendorEditRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (App.Session.currentUser.get('is_buyer') !== true) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },


  model: function(params, transition, queryParams) {
    return this.modelFor('vendor');
  },


  activate: function() {
    // When calling a record directly all of the data is side loaded, whereas when
    // listing records only basic data is sent.
    // This forces the model to reload since Ember does not call the model hook on a transition
    this.modelFor('vendor').reload();

    // TODO: Detect if model hook was called or not because if this is URL then the data
    // will get loaded twice
  },


  renderTemplate: function() {
    this.render('vendors/edit');
  }
});
