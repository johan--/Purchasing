App.UsersAccountsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'userAccount',
  needs: 'application',
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: true,


  clearEdits: function() {
    this.get('content').filterBy('isEditing').forEach(function(rec){
      rec.set('isEditing', false);
    });
  },


  clearDirty: function() {
    this.get('content').filterBy('isDirty').forEach(function(rec){
      rec.rollback();
    });
  },


  actions: {
    close: function(){
      this.clearEdits();
      this.clearDirty();
      return this.send('closeModal');
    },


    createAccount: function() {
      var newRec = this.store.createRecord('account');

      this.clearEdits();
      newRec.set('isEditing', true);

      this.pushObject(newRec);
    }
  }
});
