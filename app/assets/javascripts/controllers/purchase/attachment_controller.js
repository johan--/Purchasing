
App.AttachmentController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',


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

    removeNewAttachment: function() {
      // Only called from New Record
      this.get('parentController').removeObject(this);
    }
  }
});
