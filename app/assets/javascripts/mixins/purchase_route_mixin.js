
App.PurchaseRouteMixin = Ember.Mixin.create({


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isEditing', true);
  },



  addNewLineObjects: function(record) {
    record.get('lineItems').addObject(this.store.createRecord('lineItem'));
    record.get('notes').addObject(this.store.createRecord('note'));
  },


  actions: {

    willTransition: function(transition) {
      var model = this.get('currentModel');
      model.set('currentReceivingDoc', null); // Clear active receiving doc
      model.set('currentReceivingHoverDoc', null); // Clear active receiving doc

      if (model && model.get('isDirty')) {
        if (!confirm("You have unsaved changes. Click OK to discard these pages.")) {
          transition.abort();
        } else {
          model.rollback();
        }
      }

      return true;
    }
  }
});
