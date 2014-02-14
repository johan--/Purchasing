
App.CannedMessagesAdminController = Ember.ArrayController.extend(App.MetaDataMixin, {

  itemController: 'cannedMessageAdmin',
  needs: ['application'],
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: false,

  isEditing: function() {
    return this.filterBy('isEditing', true).length > 0;
  }.property('@each.isEditng'),


  clearEdits: function() {
    this.get('content').filterBy('isEditing').forEach(function(rec){
      rec.set('isEditing', false);
    });
  },


  actions: {
    createMessage: function() {
      var newMessage = this.store.createRecord('cannedMessage');
      newMessage.set('isEditing', true);
      this.pushObject(newMessage);
    },


    close: function(){
      return this.send('closeModal');
    }
  }
});
