
App.PurchaseEditRoute = Ember.Route.extend(App.PurchaseRouteMixin, {


  model: function(params, transition, queryParams) {
    return this.store.find('purchase', params.purchase_id);
  },


  afterModel: function(resolvedModel, transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (resolvedModel.get('can_update') !== true) {
      transition.abort();
      this.transitionTo('purchase.show', resolvedModel.id);
    }

    // Transition to show if this has been canceled
    if (resolvedModel.get('dateCanceled'))
      this.transitionTo('purchase.show', resolvedModel.id);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseEdit'
    });
  },


  activate: function() {
    // When calling a record directly all of the data is side loaded, whereas when
    // listing records only basic data is sent.
    // This forces the model to reload since Ember does not call the model hook on a transition
    var self = this,
        record = this.modelFor('purchase.edit');

    if (!isEmpty(record) && !isEmpty(record.id))
      record.reload().then(function(record){ self.addNewLineObjects(record); });
    else
      self.addNewLineObjects(record);
  }
});
