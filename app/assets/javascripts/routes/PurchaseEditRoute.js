App.PurchaseEditRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('purchase');
  },
  activate: function() {
    // When calling a record directly all of the data is side loaded, whereas when
    // listing records only basic data is sent.
    // This forces the model to reload since Ember does not call the model hook on a transition
    record = this.modelFor('purchase');
    if (!Ember.isEmpty(this.id))
      record.reload();

    // TODO: Detect if model hook was called or not because if this is URL then the data
    // will get loaded twice
  }

});
