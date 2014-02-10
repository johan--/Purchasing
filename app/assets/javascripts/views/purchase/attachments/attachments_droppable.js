
App.AttachmentsDroppable = Ember.View.extend(App.AttachmentDroppableMixin, App.AttachmentFileDroppableMixin, {

  classNames: ['attachments_box'],
  classNameBindings: ['isDragging'],
  items: null,

  template: Ember.Handlebars.compile('{{#each item in view.items}}{{render "attachment" item controller="attachment"}}{{/each}}'),


  model: function() {
    return this.get('controller.parentController.model');
  }.property('controller.parentController.model'),


  beforeUpload: function(newRec) {
    this.get('controller').addObject(newRec);
  },


  afterUpload: function() {
    this.get('controller').send('refreshDroppableViews');
  }
});
