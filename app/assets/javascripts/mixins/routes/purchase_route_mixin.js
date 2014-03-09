
App.PurchaseRouteMixin = Ember.Mixin.create({

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isEditing', true);
    App.ReceivingGlobals.resetObject();
  },


  addNewLineObjects: function(record) {
    record.get('lineItems').addObject(this.store.createRecord('lineItem'));
  },


  deactivate: function() {
    App.ReceivingGlobals.resetObject();
  },


  actions: {


    openRecordEdit: function() {
      var record = this.get('currentModel');
      this.replaceWith('purchase.edit', record);
      return false;
    },


    openRecordShow: function() {
      var record = this.get('currentModel');
      this.replaceWith('purchase.show', record);
      return false;
    },


    willTransition: function(transition) {
      App.ReceivingGlobals.resetObject();
      var self = this,
          model = this.get('currentModel'),
          notes = model.get('notes').filterBy('isDirty'),
          receivings = model.get('receivings').filterBy('isDirty');

      if (receivings.length > 0 || model.get('isDirty')) {

        if (!confirm("You have unsaved changes. Click OK to discard these pages.")) {
          transition.abort();
        } else {
          if (receivings)
            receivings.forEach(function(record) { record.rollbackWithChildren(); });

          if (notes)
            notes.forEach(function(record) { record.rollback(); });

          model.rollbackWithChildren();
        }
      }

      return true;
    }
  }

});
