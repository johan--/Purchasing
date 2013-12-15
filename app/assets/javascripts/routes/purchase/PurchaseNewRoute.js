App.PurchaseNewRoute = App.PurchaseEditRoute.extend({


  model: function(params) {
    record = this.store.createRecord('purchase', {
      dateExpected: moment().add('day', 14).format('L'),
      dateRequested: moment().format(APP_DATE_STRING),
      tax_rate: '%10.0'
    });
    return record;
  },


  activate: function() {
    record = this.modelFor('purchase.new');
    this.addNewLineObjects(record);
  },


  renderTemplate: function() {
    this.render('purchase/index', {
      controller: 'purchaseNew'
    });
  }
});

