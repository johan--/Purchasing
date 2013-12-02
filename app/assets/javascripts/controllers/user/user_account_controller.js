App.UserAccountController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',

  editingObserver: function() {
    var record = this.get('model');

    if (!this.get('isEditing') && record.get('isDirty')) {
      if(Ember.isEmpty(this.id))
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


  deleteRecordAfter: function(record, error, self) {
    self.get('parentController').pushObject(record);

    $.each(error.responseJSON, function(key, value){
      application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
    });
  },
})
