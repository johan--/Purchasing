
App.AttachmentsDroppable = Ember.View.extend(App.AttachmentDroppableMixin, {

  classNames: ['attachments_box'],
  classNameBindings: ['isDragging'],
  items: null,

  template: Ember.Handlebars.compile('{{#each view.items}}{{view App.AttachmentView}}{{/each}}'),

});
