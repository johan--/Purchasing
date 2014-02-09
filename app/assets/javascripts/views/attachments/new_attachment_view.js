
App.NewAttachmentView = Ember.View.extend({
  classNames: ['new_requisition_attachment'],
  templateName: 'attachments/new_attachment',

  actions: {

    previewNewAttachment: function() {
      var previewURL = this.get('controller.attachment_preview_url');
      $.fancybox({ href: previewURL });
    }
  }
});
