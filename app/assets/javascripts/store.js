
App.Store = DS.Store.extend();

// Custom serializer that should translate everything into a format Rails can
// process through nested attributes

// TODO: Need a better way to map record names

(function() {
  var resolve = Ember.RSVP.resolve;

  App.Store.reopen({

    findOrCreate: function(model, record) {
      if (isEmpty(record) || isEmpty(record.id))
        return;

      // Check if there are any records in the store
      var newRec = this.typeMapFor(model).idToRecord[record.id];

      // Create record
      if (isEmpty(newRec))
        newRec = this.createRecordWithoutID(model, record);

      return newRec;
    },

    // Custom createRecord to remove id coercion
    createRecordWithoutID: function(type, properties) {
      var model = this.modelFor(type);

      properties = properties || {};
      var record = this.buildRecord(model, properties.id);

      // Move the record out of its initial `empty` state into the `loaded` state.
      record.loadedData();

      // Set the properties specified on the record.
      record.setProperties(properties);

      return record;
    },

    // Search methods
    findSearch: function(queryParams, route) {
      var type = this.modelFor('purchase'),
          adapter = this.adapterFor(App.Purchase),
          resolver = Ember.RSVP.defer();

      this._findSearch(adapter, this, type, queryParams, resolver, route);

      return promiseArray(resolver.promise);
    },

    _findSearch: function(adapter, store, type, queryParams, resolver, route) {
      var promise = adapter.ajax(App.Globals.namespace + '/search', 'GET', { data: queryParams }),
          serializer = serializerForAdapter(adapter, type),
          self = this,
          recordArray = DS.AdapterPopulatedRecordArray.create({
            type: type,
            query: queryParams,
            content: Ember.A(),
            store: store
          }),
          application = store.container.lookup('controller:application');

      return resolve(promise).then(function(payload) {

        serializer.extractMeta(store, type, payload);
        payload = serializer.extractArray(store, type, payload);

        recordArray.load(payload);

        return recordArray;
      }).then(resolver.resolve, resolver.reject);
    }
  });

  //
  // Private functions from Ember-Data
  //

  DS.PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
  function promiseArray(promise) {
    return DS.PromiseArray.create({ promise: promise });
  }

  function serializerFor(container, type, defaultSerializer) {
    return container.lookup('serializer:'+type) ||
                   container.lookup('serializer:application') ||
                   container.lookup('serializer:' + defaultSerializer) ||
                   container.lookup('serializer:_default');
  }

  function serializerForAdapter(adapter, type) {
    var serializer = adapter.serializer,
        defaultSerializer = adapter.defaultSerializer,
        container = adapter.container;

    if (container && serializer === undefined) {
      serializer = serializerFor(container, type.typeKey, defaultSerializer);
    }

    if (serializer === null || serializer === undefined) {
      serializer = {
        extract: function(store, type, payload) { return payload; }
      };
    }

    return serializer;
  }

})();
