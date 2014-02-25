
App.UsersAccountsController = Ember.ObjectController.extend({

  sortProperties: ['id'],
  sortAscending: true,

  isEditing: Ember.computed.filterBy('accounts', 'isEditing', true),

  filteredAccounts: function() {
    return this.get('accounts').filterBy('isDeleted', false);
  }.property('accounts.@each.isDeleted'),


  stopEditing: function() {
    this.get('accounts').setEach('isEditing', false);
  },


  actions: {
    close: function() {
      this.stopEditing();
      return this.send('closeModal');
    },


    createAccount: function() {
      var newRec = this.store.createRecord('account');

      this.stopEditing();
      newRec.set('isEditing', true);
      newRec.set('user_id', this.get('model.id')); // Don't build a real relatioship, see account model definition
      this.get('accounts').pushObject(newRec);
    }
  }
});
