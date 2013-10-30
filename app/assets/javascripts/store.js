// Custom serializer that should translate everything into a format Rails can
// process through nested attributes

App.HasManySerializer = DS.ActiveModelSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var keys = ['attachments', 'lineItems', 'receivings', 'tags', 'notes', 'vendors', 'receivingLines'],
        key = relationship.key;

    if (keys.indexOf(key) > -1) {
      var parsed_data = Ember.get(record, key).map(function(relation) {

        var data = relation.serialize(),
            primaryKey = Ember.get(this, 'primaryKey');

        data[primaryKey] = Ember.get(relation, primaryKey) || new Date().valueOf();

        // Rename destroy field (since _destroy doesnt' work for Ember)
        if ('destroy' in data) {
          data._destroy = data.destroy || false;
          delete data.destroy;
        }

        return data;
      }, this);

      // Build null arrays (sometimes Rails rejects good values if it ever receives null instead of an empty array)
      json[key] = (Ember.isEmpty(parsed_data)) ? '[]' : parsed_data;
    }
  }
});
