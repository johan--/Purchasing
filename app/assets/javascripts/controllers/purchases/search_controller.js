
App.SearchController = App.PurchasesController.extend({

  foundCount: function() {
    var metadata = this.get('metadata');

    if (!Ember.isEmpty(metadata))
      return this.get('metadata').found_count || 0;
    else
      return 0;
  }.property('metadata.found_count'),

});
