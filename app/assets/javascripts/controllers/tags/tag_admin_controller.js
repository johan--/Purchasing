
App.TagAdminController = Ember.ObjectController.extend(App.MetaDataMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',


  editingObserver: function() {
    var record = this.get('model');

    if (!this.get('isEditing') && record.get('isDirty'))
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


    saveTag: function() {
      var record = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      record.save().then(function() {
        self.send('stopEditing');
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
      record.save().then(function(){
        application.notify({ message: 'Tag successfully deleted', type: 'notice' });

      }, function(error){
        record.rollback();

        application.notify(error);
      });
    }
  }
});
