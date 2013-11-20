App.UserAccountController = Ember.ObjectController.extend({
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
    close: function(){
      this.get('model').rollback();
      return this.send('closeModal');
    },

    startEditing: function() {
      this.get('parentController').clearEdits();
      this.set('isEditing', true);
    },

    stopEditing: function() {
      this.set('isEditing', false);
    },

    saveAccount: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.save().then(function() {
        self.send('stopEditing');
        application.notify({message: 'Account saved', type: 'notice'});

      }, function(error) {
        record.rollback();
        application.notifyWithJSON(error);
      });
    },

    deleteAccount: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.deleteRecord();
      record.save().then(function(){
        application.notify({message: 'Account successfully deleted', type: 'notice'});

      }, function(error){
        record.rollback();

        application.notifyWithJSON(error);
      });
    }

  }


})

