
App.AttachmentBigPreviewView = Ember.View.extend(App.DeleteableViewMixin, {

  classNames: ['attachment_preview'],
  templateName: 'purchase/attachment_big_preview',

  didInsertElement: function() {
    this.$().hide();
  },

  click: function() {
    this.$().hide();
  }

});
