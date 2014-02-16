
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

      model.destroyRecord().then(function() {
        self.destroy();
      }, function(error) {
        console.log(error);
        model.rollback();
      });

      return true;
    },


    showPreview: function() {
      this.previewNewAttachment();
    }
  },


  previewNewAttachment: function() {
    var previewURL = this.get('context.attachment_preview_url');
    $.fancybox({ href: previewURL });
  }
});
