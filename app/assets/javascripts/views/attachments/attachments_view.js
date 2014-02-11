
App.AttachmentsView = Ember.View.extend(App.AttachmentFileDroppableMixin, {
  classNames: ['well', 'attachments_well'],
  classNameBindings: ['isDragging'],

  template: Ember.Handlebars.compile('{{#each filteredContent}}{{view App.AttachmentView}}{{/each}}'),

  refreshViewsCounter: 1,
  includePurchase: false,


  beforeUpload: function(tempRec) {
    this.refreshDroppableViews();
  },


  afterUpload: function() {
    this.refreshDroppableViews();
  },


  refreshDroppableViews: function() {
    // We can't trust @each observer since content could be unrelated records
    var cur = this.get('refreshViewsCounter');
    this.set('refreshViewsCounter', cur + 1);
  }
});
