
App.AttachmentsView = Ember.View.extend({

  tagName: 'div',
  templateName: 'purchase/attachments_view',
  classNames: ['attachmentsContainer'],

  didInsertElement: function() {
    this.$().hide();
  },

  actions: {
    closeAttachments: function() {
      this.$().hide();
    }
  }

})
