
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',

  templateName: 'attachments/item',
  showCategory: false,
  showDelete: true,

  click: function() {
    if (App.Session.currentUser.get('is_buyer') && !this.get('context.isLoading'))
      this.get('context.model').toggleProperty('isSelected');
  }
});
