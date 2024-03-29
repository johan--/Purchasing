(function() {

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

    if (type == App.Purchase)
      return queryPurchaseFixtures(fixtures, query, type);
    else if (type == App.Account)
      return queryAccountFixtures(fixtures, query, type);
    else
      return fixtures;
  },


  pushMetaData: function(query, type) {
    var new_metadata = META_FIXTURE,
        store = lookups.store();

    Ember.merge(new_metadata, query);
    Ember.merge(store.typeMapFor(type).metadata, new_metadata);
  }
});


function queryPurchaseFixtures(fixtures, query, type) {
  return fixtures.filter(function(item) {
    var tab = Ember.tryGet(query, 'tab') || 'Pending';

    switch(tab) {
    case 'Starred':
      if(!Ember.isEmpty(item.starred))
        return true;
      break;
/*
    case 'New':
      if(Ember.isEmpty(item.buyer) && Ember.isEmpty(item.dateCanceled))
        return true;
      break;
    case 'Pending':
      if(!Ember.isEmpty(item.buyer) && Ember.isEmpty(item.datePurchased) && Ember.isEmpty(item.dateCanceled))
        return true;
      break;
*/
    case 'Purchased':
      //if(!Ember.isEmpty(item.datePurchased) && Ember.isEmpty(item.dateReconciled) && Ember.isEmpty(item.dateCanceled))
      //  return true;
      if(Ember.isEmpty(item.received_server) && Ember.isEmpty(item.dateCanceled))
        return true;
      break;
    case 'Received':
      if(!Ember.isEmpty(item.received_server) && Ember.isEmpty(item.dateCanceled))
        return true;
      break;
    case 'Canceled':
      if(!Ember.isEmpty(item.dateCanceled))
        return true;
      break;
    }

    return false;
  });
}


function queryAccountFixtures(fixtures, query, type) {
  var user_id = Ember.tryGet(query, 'user');

  console.log(111)
  if (isEmpty(user_id))
    return [];

  return fixtures.filterBy('user_id', user_id);
}

})();
