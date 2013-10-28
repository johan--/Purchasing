App.PurchaseNewRoute = Ember.Route.extend({

  model: function(params) {
    record = this.store.createRecord('purchase', {
      date_expected: moment().add('day', 14).format('L'),
      tax_rate: '.1'
    });
    return record;
  },

  renderTemplate: function() {
    this.render('purchase/edit', {
      controller: 'purchaseEdit'
    });
  }

});

