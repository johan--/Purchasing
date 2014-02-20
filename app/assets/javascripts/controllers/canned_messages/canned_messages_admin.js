
App.CannedMessagesAdminController = Ember.ArrayController.extend({

  itemController: 'cannedMessageAdmin',
  needs: ['application'],
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: false,

  isEditing: function() {
    return this.filterBy('isEditing').length > 0;
  }.property('@each.isEditing'),


  clearEdits: function() {
    this.filterBy('isEditing').setEach('isEditing', false);
  },


  actions: {
    createMessage: function() {
      var newMessage = this.store.createRecord('cannedMessage');
      newMessage.set('isEditing', true);
      this.pushObject(newMessage);
    },


    close: function(){
      this.clearEdits();
      return this.send('closeModal');
    }
  }
});
