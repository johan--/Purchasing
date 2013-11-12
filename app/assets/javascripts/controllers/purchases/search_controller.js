
App.SearchController = App.PurchasesController.extend({

  foundCount: function() {
    return this.get('metadata').found_count;
  }.property('metadata.found_count')

});
