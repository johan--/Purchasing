App.TagsController = Ember.ArrayController.extend({
  itemController: 'tag',

  tagsList: function() {
    return eval(this.get("store").metadataFor('purchase').tags); // EVIL
  }.property('metadata.tags'),

  actions: {
    createTag: function(obj) {
      this.pushObject(this.store.createRecord('tag', obj));
    }
  }

});
