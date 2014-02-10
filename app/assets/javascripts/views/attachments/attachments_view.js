
App.AttachmentsView = Ember.View.extend(App.AttachmentFileDroppableMixin, {
  classNames: ['well', 'attachments_well'],
  classNameBindings: ['isDragging'],

  templateName: 'attachments/list',
  isDroppable: false,

  refreshViewsCounter: 1,

  filteredContent: function() {
    return this.get('controller.store').all('attachment').filter(function(attachment) {
      if (isEmpty(attachment.get('purchase_id')))
        return true;
    });
  }.property('refreshViewsCounter'),


  model: function() {
    return this.get('controller.model');
  }.property('controller.model'),


  afterUpload: function() {
    this.refreshDroppableViews();
  },


  refreshDroppableViews: function() {
    // We can't trust @each observer since content could be unrelated records
    var cur = this.get('refreshViewsCounter');
    this.set('refreshViewsCounter', cur + 1);
  }
});
