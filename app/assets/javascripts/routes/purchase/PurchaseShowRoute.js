
App.PurchaseShowRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

  model: function(params, transition, queryParams) {
    return this.store.find('purchase', params.purchase_id);
  },


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isEditing', false);
    App.ReceivingGlobals.resetObject();
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseShow'
    });
  },


  activate: function() {
    var parent = this,
        record = this.modelFor('purchase.show');

    if (!isEmpty(record) && !isEmpty(record.id))
      record.reload();
  }
});
