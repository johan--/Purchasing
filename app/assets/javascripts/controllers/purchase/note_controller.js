
App.NoteController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  noteIsValid: Ember.computed.bool('text'),

  actions: {

    startEditing: function() {
      this.send('openModal', 'Note', 'purchase/notes/form', this.get('model'));
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
  }
});
