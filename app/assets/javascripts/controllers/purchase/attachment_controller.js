App.AttachmentController = Ember.ObjectController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",

  actions: {

    deleteAttachment: function() {
      var model = this.get('model'),
          self = this;

      model.destroy();
      model.save().then(function(){
        self.application.notify({message: 'Attachment deleted', type: 'success'});
      },
      function(err){
        self.application.notify({message: 'Error deleting attachment: ' + err, type: 'error'});
      })
    }
  }
})
