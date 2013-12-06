
App.ControllerSaveAndDeleteMixin = Ember.Mixin.create({


  actions: {

    saveRecord: function() {
      var record = this.get('model'),
          self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $();

      application.clearNotifications();
      spinner.show();

      if (Ember.canInvoke(self, 'saveRecordBefore'))
        self.saveRecordBefore();

      record.save().then(function(){
        application.notify({message: 'Record saved', type: 'notice'});
        self.send('closeModal');
        spinner.hide();
        if (Ember.canInvoke(self, 'saveRecordAfter')) {
          self.saveRecordAfter(record, self);
        }

      }, function(error){
        $.each(error.responseJSON, function(key, value){
          application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });

        spinner.hide();
        if (Ember.canInvoke(self, 'saveRecordAfter'))
          self.saveRecordAfter(record, error, self);
      });
    },


    deleteRecord: function(){
      var self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $();

      if (Ember.canInvoke(self, 'deleteRecordBefore'))
        self.deleteRecordBefore();

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        application.clearNotifications();
        spinner.show();

        record.deleteRecord();

        record.save().then(function(){
          application.notify({message: 'Record deleted', type: 'notice'});
          self.send('closeModal');
          if (self.domElement)
            self.domElement.fadeOut();

          spinner.hide();
          if (Ember.canInvoke(self, 'deleteRecordAfter'))
            self.deleteRecordAfter(record, self);

        }, function(error){
          record.rollback();
          $.each(error.responseJSON, function(key, value){
            application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
          });

          spinner.hide();
          if (Ember.canInvoke(self, 'deleteRecordAfter'))
            self.deleteRecordAfter(record, error, self);
        });
      }

      $('.ui-tooltip').remove();

      return false;
    }
  }
});
