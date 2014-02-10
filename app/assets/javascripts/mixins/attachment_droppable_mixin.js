
App.AttachmentDroppableMixin = Ember.Mixin.create({

  // Variables to pass in
  items: null,
  category: null,
  selectedCategory: null,
  model: null,

  // Flags
  includePurchase: null,
  isDragging: false,


  didInsertElement: function() {
    var self = this,
        category = this.get('category');

     this.$().droppable({
      hoverClass: 'is-dragging',
      accept: '.attachment',
      greedy: true,
      tolerance: 'intersect',

      drop: function(e, ui) {
        self.cancelEvents(e);
        self._dropFile(e, ui);
      }
    });

    if (Ember.canInvoke(self, 'afterInsert'))
      self.afterInsert();
  },


  willDestroyElement: function() {
    this.$().droppable('destroy');
  },


  _dropFile: function(e, ui) {
    var includePurchase = this.get('includePurchase'),
        category = null;

    if (includePurchase)
      category = this.get('category') || this.get('selectedCategory');

    if (category === 'Other')
      category = null;

    // Just updating current file
    if (ui) {
      var record_id = ui.draggable.data('attachment-id');

      if (isEmpty(record_id))
        return;

      this._updateAttachment(record_id, category, includePurchase);
      ui.draggable.slideUp();
    }
  },


  _updateAttachment: function(record_id, category, includePurchase) {
    Ember.assert('An record_id was not passed to _updateAttachment', !!record_id);
    var record = this._getAttachmentFromID(record_id);

    if (record) {
      if (includePurchase)
        record.updateCategoryAndPurchase(category, this.get('model'));
      else
        record.updateCategoryAndPurchase();
    }

    if (Ember.canInvoke(this, 'afterUpload'))
      this.afterUpload();
  },


  _getAttachmentFromID: function(id) {
    Ember.assert('An ID was not passed to _getAttachmentFromID', !!id);
    var store = this.get('model.store');

    return store.all('attachment').filter(function(rec){
      if (rec.id == id)  // Use coercion!
        return true;
    }).get('firstObject');
  }

});
