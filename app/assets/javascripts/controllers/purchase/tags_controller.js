App.TagsController = Ember.ArrayController.extend({
  itemController: 'tag',
  needs: 'purchaseEdit',
  purchaseBinding: 'controllers.purchaseEdit',


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
          if (item.get('destroy'))
            item.set('destroy', false);
          return true;
        }
      });
      if (duplicateRecs.length > 0)
        return;

      this.pushObject(this.store.findOrCreate('tag', obj));
      this.purchase.get('model').send('becomeDirty');
    }
  }
});
