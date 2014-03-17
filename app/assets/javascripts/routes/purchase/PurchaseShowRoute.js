
App.PurchaseShowRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

  model: function(params, transition, queryParams) {
    return this.store.find('purchase', params.purchase_id);
  },


  afterModel: function(resolvedModel, transition, queryParams)  {
    App.Session.setRequisition(resolvedModel);
  },


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isEditing', false);
    App.ReceivingGlobals.resetObject();
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
    this.render('purchase/form', {
      controller: 'purchaseShow'
    });
  },


  activate: function() {
    var record = this.modelFor('purchase.show');

    if (!isEmpty(record) && !isEmpty(record.id))
      record.reload();
  },


  actions: {

    willTransition: function(transition) {
      App.ReceivingGlobals.resetObject();
      var self = this,
          model = this.get('currentModel'),
          receivings = model.get('receivings').filterBy('isDirty');

      if (receivings.length > 0) {

        if (!confirm("You have unsaved changes. Click OK to discard these pages.")) {
          transition.abort();
        } else {
          receivings.forEach(function(record) { record.rollbackWithChildren(); });
        }
      }

      return true;
    }
  }
});
