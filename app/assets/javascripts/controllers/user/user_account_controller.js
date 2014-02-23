
App.UserAccountController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',

  editingObserver: function() {
    var record = this.get('model');

    if (!record.get('isEditing') && record.get('isDirty')) {
      if(isEmpty(record.id))
        record.deleteRecord();
      else
        record.rollback();
    }
  }.observes('model.isEditing'),


  actions: {
    startEditing: function() {
      this.get('parentController').stopEditing();
      this.get('model').set('isEditing', true);
    },


    stopEditing: function() {
      this.get('model').set('isEditing', false);
    }
  },


  deleteRecordAfter: function(record, self, error) {
    self.get('parentController').pushObject(record);
  },


  saveRecordAfter: function() {
    this.set('isEditing', false);
  }
});
