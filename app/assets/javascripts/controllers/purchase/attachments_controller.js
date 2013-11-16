App.AttachmentsController = Ember.ArrayController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",
  itemController: 'attachment',

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

    files.forEach(function(file) {
      if (!Ember.isEmpty(file) && !Ember.isEmpty(file).size)
        self._ajaxaFile(file);
    });
  },

  _ajaxaFile: function(file) {
    var purchase_id = this.get('target.model').id,
        formData = new FormData(),
        self = this;

    formData.append("attachment", file)

    $.ajax({
      type: 'POST',
      url: '/purchases/' + purchase_id + '/attachments',
      data: formData,
      success: function(newObject){
        console.log(newObject);
        self.pushObject(self.get('store').createRecord('attachment', newObject.attachment));
        self.application.notify({message: 'Attachment added', type: 'notice'});
      },
      fail: function(err){
        self.application.notifyWithJSON(err);
      },
      xhrFields: { onProgress: this._uploadProgress },
      cache: false,
      contentType: false,
      processData: false
    })
  },

  _uploadProgress: function(progress) {
    var percent = Math.floor((progress.total / progress.totalSize) * 100);
    console.log(percent);
  }

})
