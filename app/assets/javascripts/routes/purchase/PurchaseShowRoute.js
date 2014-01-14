
App.PurchaseShowRoute = Ember.Route.extend({


  model: function(params, transition, queryParams) {
    return this.get('store').find('purchase', params.purchase_id);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseShow'
    });
  },


  activate: function() {
    var parent = this,
        record = this.modelFor('purchase.show');

    if (!Ember.isEmpty(record) && !Ember.isEmpty(record.id))
      record.reload();
  },


  actions: {

    willTransition: function(transition) {
      this.get('currentModel').set('currentReceivingDoc', null); // Clear active receiving doc
      return true;
    }
  }
});
