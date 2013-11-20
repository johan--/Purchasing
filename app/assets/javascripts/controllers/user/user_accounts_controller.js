App.UsersAccountsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'userAccount',
  needs: 'application',
  applicationBinding: 'controllers.application',

  clearEdits: function() {
    this.get('content').filterBy('isEditing').forEach(function(rec){
      rec.set('isEditing', false);
    });
  },

  actions: {
    createAccount: function() {
      var newRec = this.store.createRecord('account');

      this.clearEdits();
      newRec.set('isEditing', true);

      this.pushObject(newRec);
    },
  }

})
