App.UserController = Ember.ObjectController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",

  actions: {
    close: function(){
      this.get('model').rollback();
      return this.send('closeModal');
    },

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
    }
  }

})
