
App.AttachmentController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  titleText: function() {
    var file = this.get('attachment_file_name'),
        type = this.get('attachment_content_type'),
        size = this.get('attachment_file_size'),
        created = this.get('created_at'),
        htmlString = '<dl>';

    htmlString += '<dt>Filename:</dt><dd>' + file + '</dd>';
    htmlString += '</dl><dl>';
    htmlString += '<dt>Type:    </dt><dd>' + type + '</dd>';
    htmlString += '</dl><dl>';
    htmlString += '<dt>Size:    </dt><dd>' + size + '</dd>';
    htmlString += '</dl><dl>';
    htmlString += '<dt>Created on:    </dt><dd>' + moment(created).format('MMM D h:mm A') + '</dd>';
    htmlString += '</dl>';

    return htmlString;
  }.property('attachment_file_name', 'attachment_content_type', 'attachment_file_size', 'created_at'),


  progressAmountStyle: function() {
    var amount = this.get('model.progressAmount') || 0;
    return 'width: ' + amount + '%';
  }.property('model.progressAmount'),


  progressText: function() {
    var amount = this.get('model.progressAmount');

    if (amount === null)
      return 'Saving...';

    if (amount >= 100)
      return 'Processing...';
    else
      return amount + '%';
  }.property('model.progressAmount'),


  updateCategoryAndPurchase: function(category, purchase) {
    var application = this.application,
        purchase_id = (purchase) ? purchase.id : null,
        model = this.get('model');

    // Fail if we are currently being processed by server
    if (this.get('isLoading'))
      return;

    if (category === 'Other')
      category = null;

    this.set('isSelected', false);
    this.set('progressAmount', null);

    if (this.get('category') !== category || this.get('purchase_id_server') !== purchase_id) {
      model.set('category', category);
      model.set('purchase', purchase);
      model.set('purchase_id_server', purchase_id);
      model.save().then(null, function(error) {
        Ember.run(function() {

          model.rollback();
          console.log(error);
          application.notify({ message: 'There was an error saving the attachment', type: 'error' });

        });
      });
    }

    if (purchase)
      purchase.get('attachments').pushObject(model);
  },


  actions: {

    removeNewAttachment: function() {
      // Only called from New Record
      if (!this.get('isLoading'))
        this.get('parentController').removeObject(this);
    },


    previewAttachment: function() {
      if (!this.get('isLoading'))
        App.FancyBox.show(this);
    },


    downloadAttachment: function() {
      if (!this.get('isLoading'))
        window.open(this.get('attachment_url'), '_blank');
    }
  },


  deleteRecordBefore: function() {
    // True cancels delete
    return this.get('isLoading');
  }
});
