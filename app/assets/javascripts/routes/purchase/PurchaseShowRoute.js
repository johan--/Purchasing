
App.PurchaseShowRoute = Ember.Route.extend({


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
  },


  actions: {

    willTransition: function(transition) {
      App.ReceivingGlobals.resetObject();
      var receivings = this.get('currentModel.receivings').filterBy('isDirty', true);

      if (receivings.length > 0) {
        if (!confirm("You have unsaved changes. Click OK to discard these pages.")) {
          transition.abort();
        } else {
          receivings.forEach(function(rec) { rec.rollback(); });
        }
      }
      return true;
    }
  }
});
