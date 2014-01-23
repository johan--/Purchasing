App.UserAccountController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',

  editingObserver: function() {
    var record = this.get('model');

    if (!this.get('isEditing') && record.get('isDirty')) {
      if(isEmpty(this.id))
        record.deleteRecord();
      else
        record.rollback();
    }


  }.observes('isEditing'),


  actions: {
    startEditing: function() {
      this.get('parentController').clearEdits();
      this.set('isEditing', true);
    },


    stopEditing: function() {
      this.set('isEditing', false);
    }
  },


  deleteRecordAfter: function(record, self, error) {
    self.get('parentController').pushObject(record);

    application.notify(error, 'error');
  },


  saveRecordAfter: function() {
    this.set('isEditing', false);
  }
});
