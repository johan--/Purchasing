App.PurchaseNewRoute = Ember.Route.extend(App.PurchaseRouteMixin, {

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


  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isEditng', true);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseNew'
    });
  }
});

