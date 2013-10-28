App.PurchaseNewRoute = Ember.Route.extend({

  model: function(params) {
    // This is getting called every time
    // But no record is being generated

    // Confirmed: this code is not the cause for the DB hit
    //return this.store.createRecord('purchase');
  },

  renderTemplate: function() {
    this.render('purchase/edit', {
      controller: 'purchaseEdit'
    });
  }

});

