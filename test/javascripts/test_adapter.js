// https://github.com/emberjs/data/blob/master/TRANSITION.md
// Most of the guides online will not reflect the newest Ember Data on how to setup the adapter
App.ApplicationAdapter = DS.FixtureAdapter.extend({

  // http://stackoverflow.com/questions/16753150/unable-to-query-emberjs-model-when-using-ds-fixtureadapter
  // It doesn't make any sense why this has to be implemented, but it currently is required
  queryFixtures: function(fixtures, query, type) {

    this.pushMetaData(query, type);

    return fixtures.filter(function(item) {
      var tab = query.tab;

      if (tab == 'New') {
        if(!Ember.isEmpty(item.buyer) || !Ember.isEmpty(item.dateCancelled))
          return false
      } else
      if (tab == 'Pending') {
        if(Ember.isEmpty(item.buyer) || !Ember.isEmpty(item.datePurchased) || !Ember.isEmpty(item.dateCancelled))
          return false
      } else
      if (tab == 'Purchased') {
        if(Ember.isEmpty(item.datePurchased) || !Ember.isEmpty(item.dateReconciled) || !Ember.isEmpty(item.dateCancelled))
          return false
      } else
      if (tab == 'Reconciled') {
        if(Ember.isEmpty(item.dateReconciled) || !Ember.isEmpty(item.dateCancelled))
          return false
      } else
      if (tab == 'Cancelled') {
        if(Ember.isEmpty(item.dateCancelled))
          return false
      }

      return true;
    });
  },

  pushMetaData: function(query, type) {
    var new_metadata = META_FIXTURE;

    Ember.merge(new_metadata, query);
    Ember.merge(store().typeMapFor(type).metadata, new_metadata)
  }
});
