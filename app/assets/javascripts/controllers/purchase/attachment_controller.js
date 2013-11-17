App.AttachmentController = Ember.ObjectController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",

  titleText: function() {
    var file = this.get('attachment_file_name'),
        type = this.get('attachment_content_type'),
        size = this.get('attachment_file_size');

    var wrapper = $('<div/>', { class: 'content' }),
        rows = $('<dl/>').append('<dt>Filename:</dt><dd>' + file + '</dd>').
                          append('<dt>Type:    </dt><dd>' + type + '</dd>').
                          append('<dt>Size:    </dt><dd>' + size + '</dd>');

    return $('<div />').append(wrapper.append(rows)).html();
  }.property('attachment_file_name', 'attachment_content_type', 'attachment_file_size'),

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
      });

      $('.ui-tooltip').remove(); // Cleanup any hung tooltips
    },

    openLargePreview: function() {
      console.log('open large');
    }
  }
})
