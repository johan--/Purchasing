
App.ControllerSaveAndDeleteMixin = Ember.Mixin.create({


  actions: {

    saveRecord: function() {
      var record = this.get('model'),
          self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $();

      application.clearNotifications();

      if (!record) {
        application.notify({ message: 'THere was an error reading the record, cannot save.  Please try reloading the app', type: 'error' });
        return;
      }

      spinner.show();

      if (Ember.canInvoke(self, 'saveRecordBefore'))
        self.saveRecordBefore();

      record.save().then(function(){
        application.notify({message: 'Record saved', type: 'notice'});
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
          self.saveRecordAfter(record, self, error);
      });

      return false;
    },


    deleteRecord: function(element){
      var self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $(),
          domElement = element || self.domElement;

      if (Ember.canInvoke(self, 'deleteRecordBefore'))
        self.deleteRecordBefore();

      if (confirm('This will permanently delete this record.  Okay to delete?')) {
        var record = this.get('model');
        application.clearNotifications();
        spinner.show();

        record.deleteRecord();

        record.save().then(function(){
          application.notify({message: 'Record deleted', type: 'notice'});
          self.send('closeModal');
          if (domElement)
            Ember.removeDom(domElement);

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
            self.deleteRecordAfter(record, self, error);
        });
      }

      $('.tooltip').remove();
      return false;
    }
  }
});
