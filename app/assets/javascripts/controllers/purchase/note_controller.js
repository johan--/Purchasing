
App.NoteController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  noteIsValid: Ember.computed.bool('text'),

  actions: {

    startEditing: function() {
      if (this.get('model.belongs_to_me'))
        this.send('openModal', 'Note', 'purchase/notes/form', this.get('model'));
      else
        this.application.notify('Sorry, you are not allowed to edit this note');
    },


    close: function() {
      var model = this.get('model');

      if (model.get('id'))
        model.rollback();
      else
        model.transitionTo('deleted.saved');

      this.send('closeModal');
    }
  },


  saveRecordAfter: function(record) {
    this.send('closeModal');
  },


  deleteRecordBefore: function() {
    return !this.get('model.belongs_to_me');
  }

});
