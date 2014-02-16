
App.TagsAdminController = Ember.ArrayController.extend({
  itemController: 'tagAdmin',

  sortProperties: ['id'],
  sortAscending: false,


  clearEdits: function() {
    this.filterBy('isEditing').setEach('isEditing', false);
  },


  actions: {
    createTag: function() {
      var newTag = this.store.createRecord('tag');
      newTag.set('isEditing', true);
      this.pushObject(newTag);
    },


    close: function(){
      this.clearEdits();
      return this.send('closeModal');
    }
  }
});
