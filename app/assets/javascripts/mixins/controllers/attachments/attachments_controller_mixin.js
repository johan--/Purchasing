
App.AttachmentsControllerMixin = Ember.Mixin.create({

  itemsAreSelected: function() {
    if (App.Session.currentUser.get('is_buyer'))
      return this.filterBy('isSelected').length > 0;
  }.property('@each.isSelected', 'app.current_user.roles'),


  numSelected: function() {
    if (App.Session.currentUser.get('is_buyer'))
      return this.filterBy('isSelected').length;
  }.property('@each.isSelected'),


  actions: {

    selectNone: function() {
      this.filterBy('isSelected').setEach('isSelected', false);
    },


    addFiles: function(files, category, includePurchase) {
      var file_list = [],
          numFiles = files.length;

      for(var i = 0; i < numFiles; i++) {
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
      tempRec = self.beforeUpload(category, purchase_id);

    formData.append('attachment', file);

    $.ajax({
      type: 'POST',
      url: App.getUrl('/attachments?' + paramString.join('&')),
      data: formData,

      progress: function(progress){
        if (isEmpty(tempRec))
          return;

        var amount = progress.loaded || 0,
            total = progress.totalSize || 0,
            calculated_total = 0;

        if (amount > 0 && total > 0)
          calculated_total = Math.floor((amount / total) * 100);

        tempRec.set('progressAmount', calculated_total);
      },
      cache: false,
      contentType: false,
      processData: false

    }).then(function(newObject) {
      Ember.run(function() {

        if (Ember.canInvoke(self, 'afterUpload') && newObject)
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
    tempRec.set('progressAmount', 0);

    this.addObject(tempRec);
    return tempRec;
  },


  afterUpload: function(tempRec, newRec) {
    Ember.assert('afterUpload was not sent a tempRec', !!tempRec);
    Ember.assert('afterUpload was not sent a payload', !!newRec);

    tempRec.deleteRecord();
    this.store.pushPayload('attachment', newRec);

    this.application.notify({ message: 'Attachment added', type: 'notice' });
  },


  errorUpload: function(tempRec, error) {
    tempRec.deleteRecord();
    this.application.notify(error);
  }

});
