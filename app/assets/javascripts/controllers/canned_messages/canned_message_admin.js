
App.CannedMessageAdminController = Ember.ObjectController.extend({
  needs: ['application'],
  applicationBinding: 'controllers.application',

  urlDefaults: ['Blank', 'Vendor', 'Requester'],

  editingObserver: function() {
    var record = this.get('model');

    if (!record.get('isEditing') && record.get('isDirty'))
      record.rollback();

  }.observes('isEditing'),


  actions: {

    startEditing: function() {
      this.get('parentController').clearEdits();
      this.set('isEditing', true);
    },


    stopEditing: function() {
      this.set('isEditing', false);
    },


    saveMessage: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.save().then(function() {
        self.send('stopEditing');
        application.notify({ message: 'Message saved', type: 'notice' });

      }, function(error) {

        record.rollback();
        application.notify(error);

      });
    },


    deleteMessage: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.deleteRecord();
      record.save().then(function(){

        application.notify({ message: 'Canned Message successfully deleted', type: 'notice' });

      }, function(error){
        record.rollback();

        application.notify(error);
      });
    }
  }
});
