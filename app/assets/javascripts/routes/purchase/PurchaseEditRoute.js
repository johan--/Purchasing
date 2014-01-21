
App.PurchaseEditRoute = Ember.Route.extend(App.PurchaseRouteMixin, {


  model: function(params, transition, queryParams) {
    return this.get('store').find('purchase', params.purchase_id);
  },


  renderTemplate: function() {
    this.render('purchase/form', {
      controller: 'purchaseEdit'
    });
  },


  activate: function() {
    // When calling a record directly all of the data is side loaded, whereas when
    // listing records only basic data is sent.
    // This forces the model to reload since Ember does not call the model hook on a transition
    var self = this,
        record = this.modelFor('purchase.edit');

    if (!Ember.isEmpty(record) && !Ember.isEmpty(record.id))
      record.reload().then(function(record){ self.addNewLineObjects(record); });
    else
      self.addNewLineObjects(record);
  }
});
