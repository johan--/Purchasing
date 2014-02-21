
App.PurchaseNewRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

  beforeModel: function(transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (!App.current_user.get('is_buyer')) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },


  model: function(params, transition, queryParams) {
    var self = this,
        newPurchaseType = 'materials',
        newAttachmentRecords = [];

    if (params && params.newPurchaseType)
      newPurchaseType = params.newPurchaseType;

    if (params && params.newAttachments)
      params.newAttachments.forEach(function(id) {
        newAttachmentRecords.push(self.store.recordForId('attachment', id));
      });

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
    $('.main_spinner').hide();
    this.render('purchase/form', {
      controller: 'purchaseNew'
    });
  }
});

