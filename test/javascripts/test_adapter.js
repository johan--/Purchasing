
// Most of the guides online will not reflect the newest Ember Data on how to setup the adapter
// https://github.com/emberjs/data/blob/master/TRANSITION.md

App.ApplicationAdapter = DS.FixtureAdapter.extend({

  ajax: $.ajax,


  serializer: {

    extract: function(store, type, payload) { return payload; },
    extractArray: function(store, type, payload) {
      if (payload && payload.purchases)
        return payload.purchases;
      else
        return [];
    },


    extractMeta: function(store, type, payload) {
      if (payload && payload.meta) {
        store.metaForType(type, payload.meta);
        delete payload.meta;
      }
    }

  },


  queryFixtures: function(fixtures, query, type) {
    this.pushMetaData(query, type);

    if (type !== App.Purchase)
      return fixtures;


    return fixtures.filter(function(item) {
      var tab = Ember.tryGet(query, 'tab') || 'Pending';

      switch(tab) {
      case 'Starred':
        if(!Ember.isEmpty(item.starred))
          return true;
        break;
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
    var new_metadata = META_FIXTURE,
        store = lookupStore();

    Ember.merge(new_metadata, query);
    Ember.merge(store.typeMapFor(type).metadata, new_metadata);
  }
});
