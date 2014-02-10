
App.AttachmentFileDroppableMixin = Ember.Mixin.create({

  // Variables to pass in
  items: null,
  category: null,
  selectedCategory: null,
  model: null,

  // Flags
  includePurchase: null,
  isDragging: false,


  dragEnter: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', true);
  },


  dragLeave: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', false);
  },


  dragOver: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', true);
  },


  drop: function(e, ui) {
    this.cancelEvents(e);
    this._dropNewFile(e, ui);
  },


  cancelEvents: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },


  _dropNewFile: function(e, ui) {
    var includePurchase = this.get('includePurchase'),
        category = null;

    if (includePurchase)
      category = this.get('category') || this.get('selectedCategory');

    if (category === 'Other')
      category = null;

    // Is this a new file?
    if (e.dataTransfer && e.dataTransfer.files) {
      this.set('isDragging', false);
      this._addFiles(e.dataTransfer.files, category, includePurchase);

      return;
    }
  },


  _addFiles: function(files, category, includePurchase) {
    var file_list = [];

    for(i = 0; i < files.length; i++) {
      file_list.push(files[i]);
    }

    this._uploadFiles(file_list, category, includePurchase);
  },


  _uploadFiles: function(files, category, includePurchase) {
    Ember.assert('No files were passed to _uploadFiles', !!files);
    var self = this,
        purchase_id = null;

    if (includePurchase)
      purchase_id = this.get('model.id');

    files.forEach(function(file) {
      if (!isEmpty(file) && !isEmpty(file).size) {
        file = Ember.merge(file);
        self._ajaxaFile(file, category, purchase_id);
      }
    });
  },


  _ajaxaFile: function(file, category, purchase_id) {
    Ember.assert('No file was passed to _ajaxaFile', !!file);
    var formData = new FormData(),
        self = this,
        store = this.get('model.store'),
        application = this.get('controller.application');

    var paramString = [];
    if (category)
      paramString.push('category=' + category);
    if (purchase_id)
      paramString.push('purchase_id=' + purchase_id);

    // Build placeholder
    var newRec = store.createRecord('attachment');

    if (Ember.canInvoke(this, 'beforeUpload'))
      this.beforeUpload(newRec);

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

        if (Ember.canInvoke(self, 'afterUpload'))
          self.afterUpload();

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
  }
});
