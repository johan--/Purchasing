
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',

  templateName: 'purchase/attachments/item',

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

    if (!this.canSelect) {
      this.$('.fancybox').fancybox();
    }
  },


  willDestroyElement: function() {
    if (this.get('canDrag'))
      this.$().draggable('destroy');

    if (!this.get('canSelect')) {
      $(document).unbind('click.fb-start');
    }

    this._super();
  },


  click: function() {
    if (!this.get('canSelect'))
      return;

    this.set('controller.isSelected', !this.get('controller.isSelected'));
  },


  attachmentPreviewURL: function() {
    if (!this.get('canSelect'))
      return this.get('controller.attachment_preview_url');
  }.property('controller.attachment_preview_url'),


  actions: {

    deleteAttachment: function() {
      var self = this,
          model = this.get('controller.model'),
          store = model.get('store');

      this.get('controller.model').destroyRecord().then(function() {

        self.destroy();

      }, function(error) {

        console.log(error);
        model.rollback();

      });

      return true;
    }
  }
});
