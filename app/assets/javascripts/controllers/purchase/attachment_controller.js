
App.AttachmentController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  progressAmount: null,
  isSelected: false,


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


  updateCategoryAndPurchase: function(category, purchase) {
    var purchase_id = (purchase) ? purchase.id : null,
        model = this.get('model');

    if (category === 'Other')
      category = null;

    this.set('isSelected', false);

    if (this.get('category') !== category || this.get('purchase_id_server') !== purchase_id) {
      model.set('category', category);
      model.set('purchase', purchase);
      model.set('purchase_id_server', purchase_id);
      model.save();
    }
  },


  actions: {

    removeNewAttachment: function() {
      // Only called from New Record
      this.get('parentController').removeObject(this);
    }
  }
});
