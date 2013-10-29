App.PurchaseNewRoute = Ember.Route.extend({

  model: function(params) {
    record = this.store.createRecord('purchase', {
      dateExpected: moment().add('day', 14).format('L'),
      tax_rate: '.1'
    });
    return record;
  },

  renderTemplate: function() {
    this.render('purchase/edit', {
      controller: 'purchaseNew'
    });
  },

  actions: {
    willTransition: function(transition) {
      // Since this is a new record we need to delete the record if it's being discarded
      var model = this.get('currentModel');
      if (model && model.get('isDirty')) {
        if (!confirm("You have unsaved changes. Click OK to discard these pages.")) {
          transition.abort();
        } else {
          model.deleteRecord();
        }
      }
    }
  }
});

