
App.ControllerSaveAndDeleteMixin = Ember.Mixin.create({
  actions: {
    saveRecord: function() {
      var record = this.get('model'),
          self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $();

      application.clearNotifications();
      spinner.show();

      record.save().then(function(){
        application.notify({message: 'Record saved', type: 'notice'});
        self.send('closeModal');
        spinner.hide();

      }, function(error){
        $.each(error.responseJSON, function(key, value){
          application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });

        spinner.hide();
      });
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
          self.send('closeModal');
          if (self.domElement)
            self.domElement.fadeOut();
          spinner.hide();

        }, function(error){
          record.rollback();
          $.each(error.responseJSON, function(key, value){
            application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
          });

          spinner.hide();
        });
      }

      $('.ui-tooltip').remove();

      return false;
    }
  }
});
