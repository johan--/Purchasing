App.PurchaseNewRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

  model: function(params, transition, queryParams) {
    return this.store.createRecord('purchase');
  },


  afterModel: function(resolvedModel, transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (resolvedModel.get('can_update') !== true) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },

  activate: function() {
    record = this.modelFor('purchase.new');
    this.addNewLineObjects(record);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseNew'
    });
  }
});

