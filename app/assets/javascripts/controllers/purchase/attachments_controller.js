App.AttachmentsController = Ember.ArrayController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",
  itemController: 'attachment',


  purchaseAttachments: function() {

  },


  globalAttachments: function() {

  },


  actions: {
    addFiles: function(files) {
      var file_list = [];

      for(i = 0; i < files.length; i++) {
        file_list.push(files[i]);
      }

      this.uploadFiles(file_list);
    },

  },


  uploadFiles: function(files) {
    var self = this;
    this.application.clearNotifications();

    files.forEach(function(file) {
      if (!isEmpty(file) && !isEmpty(file).size)
        self._ajaxaFile(file);
    });
  },


  _ajaxaFile: function(file) {
    var purchase_id = this.get('target.model').id,
        formData = new FormData(),
        self = this,
        store = this.get('store'),
        application = this.application;

    // Build placeholder
    var newRec = store.createRecord('attachment');
    this.addObject(newRec);

    formData.append("attachment", file);

    $.ajax({
      type: 'POST',
      url: '/attachments?purchase_id=' + purchase_id,
      data: formData,

      success: function(newObject){
        // Delete placeholder record
        newRec.deleteRecord();

        // Push server record (which is clean)
        store.push('attachment', newObject.attachment);

        // Build relationship
        pushedNewRec = store.getById('attachment', newObject.attachment.id);
        self.pushObject(pushedNewRec);

        application.notify({message: 'Attachment added', type: 'notice'});
      },

      error: function(error){
        newRec.deleteRecord();

        application.notify(error, 'error');
      },

      progress: function(progress){
        var amount = progress.loaded,
            total = progress.totalSize,
            result = '';

        if (amount>0 && total>0) {
          calculated_total = Math.floor((amount / total) * 100);

          if (calculated_total >= 100)
            result = 'Processing...';
          else
            result = '%' + calculated_total;
        }

        newRec.set('progressAmount', result);
      },
      cache: false,
      contentType: false,
      processData: false
    });
  },

});
