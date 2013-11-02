App.TagsController = Ember.ArrayController.extend({
  itemController: 'tag',

  // TODO: This isn't loading from purchase
  metadata: function() {
    if (this.get('model.isLoaded'))
      return this.get("store").metadataFor('purchase');
  }.property('model.isLoaded'),

  tagsList: function() {
    return eval(this.get('metadata').tags); // EVIL
  }.property('metadata.tags'),

  actions: {
    createTag: function(obj) {
      var id = obj.id;

      // Check if there are any duplicate or deleted records
      duplicateRecs = this.get('content').filter(function(item){
        if (item.id == id) {
          if (item.get('destroy'))
            item.set('destroy', false);
          return true;
        }
      });
      if (duplicateRecs.length > 0)
        return;

      this.pushObject(this.store.findOrCreate('tag', obj));
    }
  }

});
