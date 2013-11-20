
App.ControllerSaveAndDeleteMixin = Ember.Mixin.create({
  actions: {
    saveRecord: function() {
      var record = this.get('model'),
          self = this;
      this.application.clearNotifications();

      record.save().then(function(){
        self.application.notify({message: 'Record saved', type: 'notice'});
        self.send('closeModal');
      }, function(error){
        $.each(error.responseJSON, function(key, value){
          self.application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });
      });
    },

    deleteRecord: function(){
      var self = this;

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.application.clearNotifications();

        record.deleteRecord();

        record.save().then(function(){
          self.application.notify({message: 'Record deleted', type: 'notice'});
          self.send('closeModal');
          self.domElement.fadeOut();

        }, function(error){
          record.rollback();
          $.each(error.responseJSON, function(key, value){
            self.application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
          });
        });
      }

      $('.ui-tooltip').remove(); // Cleanup any hung tooltips
      return false;
    }
  }
});
