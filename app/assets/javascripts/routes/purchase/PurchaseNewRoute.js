App.PurchaseNewRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

  model: function(params, transition, queryParams) {
    record = this.store.createRecord('purchase', {
      dateExpected: moment().add('day', 14).format('L'),
      dateRequested: moment().format(App.Globals.DATE_STRING),
      tax_rate: '%10.0'
    });
    return record;
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


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isEditng', true);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseNew'
    });
  }
});

