
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',

  templateName: 'attachments/item',
  showCategory: false,


  click: function() {
    if (App.current_user.get('is_buyer'))
      this.get('context.model').toggleProperty('isSelected');
  },


  actions: {

    deleteAttachment: function() {
      var self = this,
          model = this.get('context.model');

      this.get('controller').send('deleteRecord');

      return true;
    },


    showPreview: function() {
      this.get('controller').send('previewNewAttachment');
    }
  }
});
