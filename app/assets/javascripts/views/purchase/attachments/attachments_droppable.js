
App.AttachmentsDroppable = Ember.View.extend(App.AttachmentDroppableMixin, {

  classNames: ['attachments_box'],
  classNameBindings: ['isDragging'],
  items: null,

  template: Ember.Handlebars.compile('{{#each item in view.items}}{{render "attachment" item controller="attachment"}}{{/each}}'),

});
