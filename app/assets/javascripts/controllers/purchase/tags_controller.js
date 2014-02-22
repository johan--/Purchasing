
App.TagsController = Ember.ArrayController.extend({

  needs: ['application'],
  applicationBinding: 'controllers.application',

  itemController: 'tag',


  tagsList: function() {
    return this.store.all('tag');
  }.property('metadata.tags'),


  actions: {
    createTag: function(obj) {
      this.application.clearNotifications();

      // Check if there are any duplicate or deleted records
      duplicateRec = this.get('content').filter(function(item) {
        return item.id == obj.id; // Use coercion
      });

      if (duplicateRec && duplicateRec.length > 0) {
        if (duplicateRec.get('isDestroy'))
          duplicateRec.set('isDestroy', false);
        else
          this.application.notify({message: 'Cannot add a second copy of a tag', type: 'warning'});

        return;
      }

      this.pushObject(this.store.findOrCreate(App.Tag, obj));
      // Must manually tell the parent to become dirty
      this.get('parentController.model').send('becomeDirty');
    },


    removeTag: function(tag) {
      tag.set('isDestroy', true);
      // Must manually tell the parent to become dirty
      this.get('parentController.model').send('becomeDirty');
    }
  }
});
