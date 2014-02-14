
App.TagsAdminController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'tagAdmin',
  needs: ['application'],
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: false,


  clearEdits: function() {
    this.get('content').filterBy('isEditing').forEach(function(rec){
      rec.set('isEditing', false);
    });
  },


  actions: {
    createTag: function() {
      var newTag = this.store.createRecord('tag');
      newTag.set('isEditing', true);
      this.pushObject(newTag);
    },


    close: function(){
      return this.send('closeModal');
    }
  }
});
