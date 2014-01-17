
App.AttachmentView = Ember.View.extend(App.DeleteableViewMixin, {
  tagName: 'duv',
  classNames: 'attachmentDroppable',
  templateName: 'purchase/attachment_view',

  didInsertElement: function() {
    var id = this.get('context.id');
    if (id)
      this.$().data('attachment-id', id);

    this.$().draggable({
      revert: 'invalid'
    });
  }
});
