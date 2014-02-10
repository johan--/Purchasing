
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',

  templateName: 'attachments/item',

  canDrag: true,
  canSelect: false,

  didInsertElement: function() {
    var id = this.get('context.id');
    if (id)
      this.$().data('attachment-id', id);

    if (this.get('canDrag')) {
      this.$().draggable({
        revert: 'invalid'
      });
    }
  },


  willDestroyElement: function() {
    if (this.get('canDrag'))
      this.$().draggable('destroy');

    this._super();
  },


  click: function() {
    if (this.get('canSelect'))
      this.set('controller.isSelected', !this.get('controller.isSelected'));
    else
      this.previewNewAttachment();
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
