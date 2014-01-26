
App.Store = DS.Store.extend();

// Custom serializer that should translate everything into a format Rails can
// process through nested attributes

// TODO: Need a better way to map record names

(function() {
  var resolve = Ember.RSVP.resolve;

  App.Store.reopen({

    // FindOrCreate (why isn't this in Ember yet??)
    findOrCreate: function(model, record) {
      // Check if there are any records in the store
      var newRec = this.filter(model, function(oneRecord){
        if (oneRecord.id == record.id) {
          return true;
        }
      }).get('firstObject');

      // Create record
      if (isEmpty(newRec)) {
        newRec = this.createRecordWithoutID(model, record);
      }

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
      var promise = adapter.ajax('/search', 'GET', { data: queryParams }),
          serializer = serializerForAdapter(adapter, type),
          self = this,
          recordArray = DS.AdapterPopulatedRecordArray.create({
            type: type,
            query: queryParams,
            content: Ember.A(),
            store: store
          }),
          application = store.container.lookup('controller:application');

      return resolve(promise).catch(function(error){

        application.notify({ message: error.responseText, type: 'error'});

      }).then(function(payload) {

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


// Custom Serializer

App.SerializeMyChildren = DS.ActiveModelSerializer.extend({

  serializeAttribute: function(record, json, key, attribute) {
    var keys = ['buyer', 'requester', 'recipient'],
        value = Ember.get(record, key),
        type = attribute.type;

    if (type) {
      var transform = this.transformFor(type);
      value = transform.serialize(value);
    }

    // For user objects, only save the ID
    if (keys.indexOf(key) > -1 && !isEmpty(value)) {
      value = value.id;
    }

    // Convert camelized to underscore
    key = key.decamelize();

    json[key] = value;
  },

  serializeHasMany: function(record, json, relationship) {
    var keys = { attachments: 'attachments_attributes', lineItems: 'line_items_attributes',
                 receivings: 'receivings_attributes', tags: 'purchase_to_tags_attributes',
                 notes: 'notes_attributes', vendors: 'vendors',
                 receivingLines: 'receiving_lines_attributes' },
        key = relationship.key;

    // Special case for vendors since we can also add vendors
    if (key == 'vendors') {
      json['vendors'] = this.fixVendorData(record) || [];
      return;
    }

    if (key in keys) {
      var lineCounter = 0;

      var parsed_data = {};
      Ember.get(record, key).map(function(relation) {

        var data = relation.serialize(),
            primaryKey = Ember.get(this, 'primaryKey');

        data[primaryKey] = Ember.get(relation, primaryKey);
        this.renameDestroyField(data);

        // Tags (since this is a many to many relationship)
        if (key == 'tags')
          this.fixTagData(data, record);

        // ID Fix
        if (data.id === null)
          data.id = "";

        // Cleanup
        delete data.purchases_id;
        delete data.created_at;
        delete data.updated_at;

        parsed_data[lineCounter.toString()] = data;
        lineCounter += 1;
      }, this);

      // Build null arrays (sometimes Rails rejects good values if it ever receives null instead of an empty array)
      json[keys[key]] = (isEmpty(parsed_data)) ? '[]' : parsed_data;
    }
  },

  // Rename destroy field (since _destroy doesnt' work for Ember)
  renameDestroyField: function(data) {
    if ('isDestroy' in data) {
      data._destroy = (data.isDestroy || false).toString();
      delete data.destroy;
    }
  },

  fixTagData: function(data, record) {
    data.tag_id = data.id;
    data.id = this.checkForTags(data.tag_id, record.get('purchaseToTags'));
  },

  // Get the join table ID for the tag
  checkForTags: function(tag_id, tags) {
    id = null;

    tags.forEach(function(tag) {
      if (tag.get('tag_id') == tag_id)
        id = tag.id;
    });

    return id;
  },

  // Build Vendors JSON string
  fixVendorData: function(record) {
    var names = record.get('vendors').reduce(function(res, vendor){
      res.push({name: vendor.get('name'), id: vendor.id});
      return res;
    }, []);

    return JSON.stringify(names);
  }
});


// TODO: Need better error checking!
