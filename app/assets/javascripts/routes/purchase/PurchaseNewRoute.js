
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
        newAttachmentRecords = null;

    if (params && params.newPurchaseType)
      newPurchaseType = params.newPurchaseType;

    if (params && params.newAttachments) {
      var newAttachments = params.newAttachments;

      newAttachmentRecords = this.store.all('attachment').filter(function(item) {
        if (newAttachments.indexOf(item.id) > -1)
          return true;
      });
    }

    var newRecord = this.store.createRecord('purchase', { purchase_type: newPurchaseType });
    if (newAttachmentRecords)
      newRecord.get('attachments').pushObjects(newAttachmentRecords);

    return newRecord;
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

