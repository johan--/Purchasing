App.PurchaseEditRoute = Ember.Route.extend({


  model: function(params) {
    return this.get('store').find('purchase', params.purchase_id);
  },


  renderTemplate: function() {
    this.render('purchase/index', {
      controller: 'purchaseEdit'
    });
  },


  activate: function() {
    // When calling a record directly all of the data is side loaded, whereas when
    // listing records only basic data is sent.
    // This forces the model to reload since Ember does not call the model hook on a transition
    var parent = this,
        record = this.modelFor('purchase.edit');

    if (!Ember.isEmpty(record) && !Ember.isEmpty(record.id))
      record.reload().then(function(record){ parent.addNewLineObjects(record); });
    else
      parent.addNewLineObjects(record);
  },


  addNewLineObjects: function(record) {
    record.get('lineItems').addObject(this.store.createRecord('lineItem'));
    record.get('notes').addObject(this.store.createRecord('note'));
  },


  actions: {

    willTransition: function(transition) {
      var model = this.get('currentModel');
      model.set('currentReceivingDoc', null); // Clear active receiving doc

      if (model && model.get('recIsDirty')) {
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
