
App.PurchaseAttachmentsController = Ember.ArrayController.extend({
  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  refreshViewsCounter: 1,

  actions: {
    addFiles: function(files, category, includePurchase) {
      var file_list = [];

      for(i = 0; i < files.length; i++) {
        file_list.push(files[i]);
      }

      this.uploadFiles(file_list, category, includePurchase);

      this._refreshDroppableViews();
    },


    updateAttachment: function(record_id, category, includePurchase) {
      var record = this.getAttachmentFromID(record_id);

      if (record) {
        if (includePurchase)
          record.updateCategoryAndPurchase(category, this.get('parentController.model'));
        else
          record.updateCategoryAndPurchase();
      }

      this._refreshDroppableViews();
    }
  },


  uploadFiles: function(files, category, includePurchase) {
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
    var formData = new FormData(),
        self = this,
        store = this.store,
        application = this.application;

    var paramString = [];
    if (category)
      paramString.push('category=' + category);
    if (purchase_id)
      paramString.push('purchase_id=' + purchase_id);

    // Build placeholder
    var newRec = store.createRecord('attachment');
    this.addObject(newRec);

    formData.append('attachment', file);

    $.ajax({
      type: 'POST',
      url: App.Globals.namespace + '/attachments?' + paramString.join('&'),
      data: formData,

      success: function(newObject){
        // Delete placeholder record
        newRec.deleteRecord();

        // Push server record (which is clean)
        store.pushPayload('attachment', newObject);

        // Build relationship
        //pushedNewRec = store.getById('attachment', newObject.attachment.id);
        //self.pushObject(pushedNewRec);
        self._refreshDroppableViews();
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


  getAttachmentFromID: function(id) {
    return this.store.all('attachment').filter(function(rec){
      if (rec.id == id)  // Use coercion!
        return true;
    }).get('firstObject');
  },


  _refreshDroppableViews: function() {
    // We can't trust @each observer since content could be unrelated records
    var cur = this.get('refreshViewsCounter');
    this.set('refreshViewsCounter', cur + 1);
  }

});
