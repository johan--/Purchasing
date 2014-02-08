
App.PurchaseNewRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

  beforeModel: function(transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (!App.current_user.get('is_buyer')) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },


  model: function(params, transition, queryParams) {
    var newPurchaseType = 'materials',
        attachmentsForNew = [];

    if (params && params.newPurchaseType)
      newPurchaseType = params.newPurchaseType;

    if (params && params.attachmentsForNew)
      attachmentsForNew = params.attachmentsForNew;

    return this.store.createRecord('purchase', { purchase_type: newPurchaseType, new_attachments: attachmentsForNew });
  },


  setupController: function(controller, model) {
    App.ReceivingGlobals.resetObject();

    controller.set('model', model);
    controller.set('isEditing', true);

    model.set('buyer', { id: App.current_user.id, name: App.current_user.get('name') });
    this.addNewLineObjects(model);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseNew'
    });
  }
});

