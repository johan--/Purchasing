
App.AttachmentView = Ember.View.extend(App.DeleteableViewMixin, {
  tagName: 'div',
  classNames: 'attachmentDroppable',
  templateName: 'purchase/attachments/item',

  didInsertElement: function() {
    var id = this.get('context.id');
    if (id)
      this.$().data('attachment-id', id);

    this.$().draggable({
      revert: 'invalid'
    });

    this.$('.fancybox').fancybox();
  }
});