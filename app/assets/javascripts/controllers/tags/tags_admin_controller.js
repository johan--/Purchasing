
App.TagsAdminController = Ember.ArrayController.extend({
  itemController: 'tagAdmin',
  needs: ['application'],
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: false,


  clearEdits: function() {
    this.filterBy('isEditing').forEach(function(item) {
      item.toggleProperty('isEditing');
      console.log(item.get('isEditing'));
    });
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
