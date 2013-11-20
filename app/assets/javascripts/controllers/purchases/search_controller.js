
App.SearchController = Ember.ArrayController.extend(App.PurchasesControllerMixin, {

  foundCount: function() {
    var metadata = this.get('metadata');

    if (!Ember.isEmpty(metadata))
      return this.get('metadata').found_count || 0;
    else
      return 0;
  }.property('metadata.found_count'),

});
