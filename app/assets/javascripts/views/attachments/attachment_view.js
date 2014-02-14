
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',

  templateName: 'attachments/item',
  showCategory: false,


  click: function() {
    this.set('context.model.isSelected', !this.get('context.model.isSelected'));
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
