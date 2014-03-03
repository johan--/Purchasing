
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',

  templateName: 'attachments/item',
  showCategory: false,
  showDelete: true,

  click: function() {
    if (App.current_user.get('is_buyer') && !this.get('context.isLoading'))
      this.get('context.model').toggleProperty('isSelected');
  }
});
