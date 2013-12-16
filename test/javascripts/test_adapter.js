
// Most of the guides online will not reflect the newest Ember Data on how to setup the adapter
// https://github.com/emberjs/data/blob/master/TRANSITION.md

App.ApplicationAdapter = DS.FixtureAdapter.extend({

  queryFixtures: function(fixtures, query, type) {
    this.pushMetaData(query, type);

    return fixtures.filter(function(item) {
      var tab = Ember.tryGet(query, 'tab') || 'Pending';

      switch(tab) {
      case 'New':
        if(Ember.isEmpty(item.buyer) && Ember.isEmpty(item.dateCancelled))
          return true;
        break;
      case 'Pending':
        if(!Ember.isEmpty(item.buyer) && Ember.isEmpty(item.datePurchased) && Ember.isEmpty(item.dateCancelled))
          return true;
        break;
      case 'Purchased':
        if(!Ember.isEmpty(item.datePurchased) && Ember.isEmpty(item.dateReconciled) && Ember.isEmpty(item.dateCancelled))
          return true;
        break;
      case 'Reconciled':
        if(!Ember.isEmpty(item.dateReconciled) && Ember.isEmpty(item.dateCancelled))
          return true;
        break;
      case 'Cancelled':
        if(!Ember.isEmpty(item.dateCancelled))
          return true;
        break;
      }

      return false;
    });
  },

  pushMetaData: function(query, type) {
    var new_metadata = META_FIXTURE;

    Ember.merge(new_metadata, query);
    Ember.merge(store().typeMapFor(type).metadata, new_metadata);
  }
});
