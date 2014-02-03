
App.AttachmentView = Ember.View.extend({
  tagName: 'div',
  classNames: 'attachment',
  templateName: 'purchase/attachments/item',

  didInsertElement: function() {
    var id = this.get('context.id');
    if (id)
      this.$().data('attachment-id', id);

    this.$().draggable({
      revert: 'invalid'
    });

    this.$('.fancybox').fancybox();
  },


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
