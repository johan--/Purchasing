
App.TagsController = Ember.ArrayController.extend({

  itemController: 'tag',

  metadata: function() {
    if (this.get('model.isLoaded'))
      return this.get('store').metadataFor('purchase');
  }.property('model.isLoaded'),


  tagsList: function() {
    return this.get('metadata.tags');
  }.property('metadata.tags'),


  actions: {
    createTag: function(obj) {
      var id = obj.id;

      // Check if there are any duplicate or deleted records
      duplicateRecs = this.get('content').filter(function(item){
        if (item.id == id) {
          if (item.get('isDestroy'))
            item.set('isDestroy', false);
          return true;
        }
      });
      if (duplicateRecs.length > 0)
        return;

      this.pushObject(this.store.findOrCreate('tag', obj));
      // Must manually tell the parent to become dirty
      this.get('parentController.model').send('becomeDirty');
    }
  }
});
