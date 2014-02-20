
App.PurchaseAttachmentsList = Ember.View.extend(App.AttachmentFileDroppableMixin, {

  classNames: ['attachments_box'],
  classNameBindings: ['isDragging'],
  items: null,

  template: Ember.Handlebars.compile('{{#each view.content}}{{view App.AttachmentView}}{{/each}}'),

});
