
App.NoteController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  actions: {

    startEditing: function() {
      this.send('openModal', 'Note', 'purchase/notes/form', this.get('model'));
    },


    close: function() {
      if (this.get('id'))
        this.get('model').rollback();

      this.send('closeModal');
    }
  },


  saveRecordAfter: function(record) {
    this.send('closeModal');
  }
});
