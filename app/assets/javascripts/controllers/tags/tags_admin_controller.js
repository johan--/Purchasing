App.TagsAdminController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'tagAdmin',
  needs: ['application'],
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: true,


  clearEdits: function() {
    this.get('content').filterBy('isEditing').forEach(function(rec){
      rec.set('isEditing', false);
    });
  },


  actions: {
    createTag: function() {
      this.pushObject(this.store.createRecord('tag'));
    },


    close: function(){
      return this.send('closeModal');
    }
  }
});
