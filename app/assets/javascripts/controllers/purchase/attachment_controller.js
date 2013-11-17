App.AttachmentController = Ember.ObjectController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",

  actions: {

    deleteAttachment: function() {
      var model = this.get('model'),
          self = this,
          application = this.application;

      application.clearNotifications();

      if (model.get('isSaving')) {
        console.log('error: conflict with isSaving');
        return;
      }

      model.deleteRecord();

      model.save().then(function(){
        application.notify({message: 'Attachment deleted', type: 'notice'});
      },

      function(err){
        model.rollback();
        application.notify({message: 'Error deleting attachment: ' + err, type: 'error'});
      })
    },

    openLargePreview: function() {
      console.log('open large');
    }
  }
})
