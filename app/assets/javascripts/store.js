// Custom serializer that should translate everything into a format Rails can
// process through nested attributes

// TODO: Need a better way to map record names

App.Store = DS.Store.extend({

  findOrCreate: function(model, record) {
    // Check if there are any records in the store
    var newRec = this.filter(model, function(oneRecord){
      if (oneRecord.id == record.id) {
        return true;
      }
    }).get('firstObject');

    // Create record
    if (Ember.isEmpty(newRec)) {
      newRec = this.createRecordWithoutID(model, record);
    }

    return newRec;
  },

  // Custom createRecord to remove id coercion
  createRecordWithoutID: function(type, properties) {
    var type = this.modelFor(type);

    properties = properties || {};
    var record = this.buildRecord(type, properties.id);

    // Move the record out of its initial `empty` state into the `loaded` state.
    record.loadedData();

    // Set the properties specified on the record.
    record.setProperties(properties);

    return record;
  },


});

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
    if (keys.indexOf(key) > -1 && !Ember.isEmpty(value)) {
      value = value.id;
    }

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
        if (data.id == null)
          data.id = "";

        // Cleanup
        delete data.purchases_id;
        delete data.created_at;
        delete data.updated_at;

        parsed_data[lineCounter.toString()] = data;
        lineCounter += 1;
      }, this);

      // Build null arrays (sometimes Rails rejects good values if it ever receives null instead of an empty array)
      json[keys[key]] = (Ember.isEmpty(parsed_data)) ? '[]' : parsed_data;
    }
  },

  // Rename destroy field (since _destroy doesnt' work for Ember)
  renameDestroyField: function(data) {
    if ('destroy' in data) {
      data._destroy = (data.destroy || false).toString();
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
    })
    return id;
  },

  fixVendorData: function(record) {
    names = [];
    record.get('vendors').forEach(function(vendor){
      console.log(vendor);
      names.push(vendor.get('name'));
    })
    console.log(names.join());
    return names.join();
  }
});


// TODO: Need better error checking!
