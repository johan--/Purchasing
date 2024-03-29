
App.TagAdminController = Ember.ObjectController.extend(App.MetaDataMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',

  editingObserver: function() {
    var record = this.get('model');

    if (!record.get('isEditing') && record.get('isDirty'))
      record.rollback();

  }.observes('isEditing'),


  actions: {

    startEditing: function() {
      this.get('parentController').clearEdits();
      this.get('model').set('isEditing', true);
    },


    stopEditing: function() {
      this.get('model').set('isEditing', false);
    },


    saveTag: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.save().then(function() {

        record.set('isEditing', false);
        application.notify({ message: 'Tag saved', type: 'notice' });

      }, function(error) {

        record.rollback();
        application.notify(error);

      });
    },


    deleteTag: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.deleteRecord();
      record.save().then(function() {

        application.notify({ message: 'Tag successfully deleted', type: 'notice' });

      }, function(error){

        record.rollback();
        application.notify(error);

      });
    }
  }
});
