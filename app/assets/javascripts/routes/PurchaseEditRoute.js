App.PurchaseEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('purchase', params.purchase_id);
  },

  activate: function() {
    // When calling a record directly all of the data is side loaded, whereas when
    // listing records only basic data is sent.
    // This forces the model to reload since Ember does not call the model hook on a transition

    record = this.modelFor('purchase.edit');
    if (!Ember.isEmpty(record) && !Ember.isEmpty(record.id))
      record.reload();
  },

  actions: {
    willTransition: function(transition) {

      var model = this.get('currentModel');
      if (model && model.get('isDirty')) {
        if (!confirm("You have unsaved changes. Click OK to discard these pages.")) {
          transition.abort();
        } else {
          model.rollback();
        }
      }
    }
  }

});
