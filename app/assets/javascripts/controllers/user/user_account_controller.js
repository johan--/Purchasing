
App.UserAccountController = Ember.ObjectController.extend({

  needs: ['application'],
  applicationBinding: 'controllers.application',

  editingObserver: function() {
    var record = this.get('model');

    if (!record.get('isEditing') && record.get('isDirty')) {
      record.rollback();
    }
  }.observes('isEditing'),


  actions: {

    startEditing: function() {
      this.get('parentController').stopEditing();
      this.get('model').set('isEditing', true);
    },


    stopEditing: function() {
      this.get('model').set('isEditing', false);
    },


    saveRecord: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.save().then(function() {

        record.set('isEditing', false);
        application.notify({ message: 'Account saved', type: 'notice' });

      }, function(error) {

        record.rollback();
        application.notify(error);

      });
    },


    deleteRecord: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.deleteRecord();
      record.save().then(function() {

        application.notify({ message: 'Account successfully deleted', type: 'notice' });

      }, function(error){

        record.rollback();
        application.notify(error);

     });
    }
  }
});
