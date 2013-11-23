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
    },

    deleteRecord: function(){
      var self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $();

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        application.clearNotifications();
        spinner.show();

        record.deleteRecord();

        record.save().then(function(){
          application.notify({message: 'Record deleted', type: 'notice'});

          if (self.domElement)
            self.domElement.fadeOut();
          spinner.hide();

        }, function(error){
          record.rollback();
          // The record is still in the cache but Ember won't rebuild the relationship on rollback
          self.get('parentController').pushObject(record);

          $.each(error.responseJSON, function(key, value){
            application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
          });

          spinner.hide();
        });
      }
    }
  }

})

