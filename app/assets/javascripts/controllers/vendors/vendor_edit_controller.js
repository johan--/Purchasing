App.VendorEditController = Ember.ObjectController.extend(App.ControllerNotifiableMixin, {

  actions: {
    close: function(){
      this.get('model').rollback();
      return this.send('closeModal');
    },

    deleteRecord: function(){
      self = this;

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.clearNotifications();

        record.deleteRecord();

        record.save().then(function(){
          self.send('closeModal');
        }, function(error){
          record.rollback();
          $.each(error.responseJSON, function(key, value){
            record.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
          });
        });
      }
      return false;
    },

    saveRecord: function() {
      var record = this.get('model'),
      self = this;
      this.clearNotifications();

      record.save().then(function(){
        self.send('closeModal');
      }, function(error){
        $.each(error.responseJSON, function(key, value){
          record.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });
      });
    }
  }
})
