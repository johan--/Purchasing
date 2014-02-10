
App.AttachmentController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  progressAmount: null,

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


  progressAmountStyle: function() {
    var amount = this.get('model.progressAmount') || 0;
    return 'width: ' + amount + '%';
  }.property('model.progressAmount'),


  progressText: function() {
    var amount = this.get('model.progressAmount') || 0;
    if (amount >= 100)
      return 'Processing...';
    else
      return '%' + amount;
  }.property('model.progressAmount'),


  actions: {

    removeNewAttachment: function() {
      // Only called from New Record
      this.get('parentController').removeObject(this);
    }
  }
});
