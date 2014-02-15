
App.UsersAccountsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'userAccount',
  needs: ['application'],
  applicationBinding: 'controllers.application',

  sortProperties: ['id'],
  sortAscending: true,


  clearEdits: function() {
    this.filterBy('isEditing').setEach('isEditing', false);
  },


  clearDirty: function() {
    this.filterBy('isDirty').forEach(function(rec){
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
