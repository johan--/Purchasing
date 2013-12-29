
App.PurchaseShowRoute = Ember.Route.extend({


  model: function(params) {
    return this.get('store').find('purchase', params.purchase_id);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseShow'
    });
  },


  activate: function() {
    var parent = this,
        record = this.modelFor('purchase.edit');

    if (!Ember.isEmpty(record) && !Ember.isEmpty(record.id))
      record.reload();
  },


  actions: {

    willTransition: function(transition) {
      var model = this.get('currentModel');
      model.set('currentReceivingDoc', null); // Clear active receiving doc
      return true;
    }
  }
});
