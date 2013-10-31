// Custom serializer that should translate everything into a format Rails can
// process through nested attributes

// TODO: Need a better way to map record names

App.SerializeMyChildren = DS.ActiveModelSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var keys = { attachments: 'attachments_attributes', lineItems: 'line_items_attributes',
                 receivings: 'receivings_attributes', tags: 'purchase_to_tags_attributes',
                 notes: 'notes_attributes', vendors: 'vendors',
                 receivingLines: 'receiving_lines_attributes' },
        key = relationship.key;

    if (key in keys) {
      var lineCounter = 0;

      var parsed_data = {};
      Ember.get(record, key).map(function(relation) {

        var data = relation.serialize(),
            primaryKey = Ember.get(this, 'primaryKey');
        data[primaryKey] = Ember.get(relation, primaryKey)

        // Rename destroy field (since _destroy doesnt' work for Ember)
        if ('destroy' in data) {
          data._destroy = (data.destroy || false).toString();
          delete data.destroy;
        }

        // Tags (since this is a many to many relationship)
        if (key == 'tags') {
          data.tag_id = data.id;
          console.log(data);
          data.id = this.checkForTags(data.tag_id, record.get('purchaseToTags'));
        }

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

  // Get the join table ID for the tag
  checkForTags: function(tag_id, tags) {
    id = null;
    tags.forEach(function(tag) {
      if (tag.get('tag_id') == tag_id)
        id = tag.id;
    })
    return id;
  }
});


// TODO: Need better error checking!
