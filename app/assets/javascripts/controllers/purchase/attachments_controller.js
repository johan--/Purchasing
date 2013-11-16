App.AttachmentsController = Ember.ArrayController.extend({
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
        formData = new FormData();

    formData.append("file", file)

    $.ajax({
      type: 'POST',
      url: '/purchases/' + purchase_id + '/attachments',
      data: formData,
      success: this._uploadSuccess,
      fail: this._uploadSuccess,
      xhrFields: { onProgress: this._uploadProgress },
      cache: false,
      contentType: false,
      processData: false
    })
  },

  _uploadSuccess: function() {
    console.log('success');
  },

  _uploadFail: function(err) {
    console.log('fail');
  },

  _uploadProgress: function(progress) {
    var percent = Math.floor((progress.total / progress.totalSize) * 100);
    console.log(percent);
  }

})
