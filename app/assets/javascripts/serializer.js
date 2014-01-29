
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
          this.addTagJoinTableID(data, record);

        // ID Fix
        if (data.id === null)
          data.id = "";

        // Cleanup
        delete data.purchases_id;
        delete data.created_at;
        delete data.updated_at;

        // Add line counter for Rails nested attributes
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

  addTagJoinTableID: function(data, record) {
    data.tag_id = data.id;

    // We need to match up these tags with any purchaseToTags we received from server
    // If there isn't a record from the server, this will be null since we need to create a record
    data.id = this.getPurchaseToTagsID(data.tag_id, record.get('purchaseToTags'));
  },

  // Get the join table ID for the tag
  getPurchaseToTagsID: function(tag_id, serverTags) {
    id = null;

    serverTags.forEach(function(serverTag) {
      if (serverTag.get('tag_id') == tag_id)
        id = serverTag.id;
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
