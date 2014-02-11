
App.AttachmentsControllerMixin = Ember.Mixin.create({


  itemsAreSelected: function() {
    return this.filterBy('isSelected', true).length > 0;
  }.property('@each.isSelected'),


  numSelected: function() {
    return this.filterBy('isSelected', true).length;
  }.property('@each.isSelected'),


  actions: {
    addFiles: function(files, category, includePurchase) {
      var file_list = [];

      for(i = 0; i < files.length; i++) {
        file_list.push(files[i]);
      }

      this._uploadFiles(file_list, category, includePurchase);
    }
  },


  _uploadFiles: function(files, category, includePurchase) {
    Ember.assert('No files were passed to _uploadFiles', !!files);
    var self = this,
        purchase_id = null;

    if (includePurchase)
      purchase_id = this.get('parentController.model.id');

    files.forEach(function(file) {
      if (!isEmpty(file) && !isEmpty(file).size) {
        file = Ember.merge(file);
        self._ajaxaFile(file, category, purchase_id);
      }
    });
  },


  _ajaxaFile: function(file, category, purchase_id) {
    Ember.assert('No file was passed to _ajaxaFile', !!file);
    var self = this,
        formData = new FormData(),
        tempRec = null;

    var paramString = [];
    if (category)
      paramString.push('category=' + category);
    if (purchase_id)
      paramString.push('purchase_id=' + purchase_id);

    if (Ember.canInvoke(self, 'beforeUpload'))
      tempRec = self.beforeUpload();

    formData.append('attachment', file);

    $.ajax({
      type: 'POST',
      url: App.Globals.namespace + '/attachments?' + paramString.join('&'),
      data: formData,

      progress: function(progress){
        if (isEmpty(tempRec))
          return;

        var amount = progress.loaded,
            total = progress.totalSize,
            result = '';

        if (amount>0 && total>0) {
          var calculated_total = Math.floor((amount / total) * 100);
          tempRec.set('progressAmount', calculated_total);
        }
      },
      cache: false,
      contentType: false,
      processData: false

    }).then(function(newObject) {
      Ember.run(function() {

        if (Ember.canInvoke(self, 'afterUpload'))
          self.afterUpload(tempRec, newObject);
      });
    }, function(error) {
      Ember.run(function() {

      if (Ember.canInvoke(self, 'errorUpload'))
        self.errorUpload(tempRec, error);

      });
    });
  },


  beforeUpload: function() {
    var tempRec = this.store.createRecord('attachment');

    this.addObject(tempRec);
    return tempRec;
  },


  afterUpload: function(tempRec, newRec) {
    console.log(newRec);

    tempRec.deleteRecord();
    this.store.pushPayload('attachment', newRec);

    this.application.notify({message: 'Attachment added', type: 'notice'});
  },


  errorUpload: function(tempRec, error) {
    tempRec.deleteRecord();
    this.application.notify(error, 'error');
  }

});
