
App.AttachmentDroppableMixin = Ember.Mixin.create({

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
    this._dropFile(e, ui);
  },


  cancelEvents: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },


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


  _dropFile: function(e, ui) {
    var includePurchase = this.get('includePurchase'),
        category = null;

    if (includePurchase)
      category = this.get('category') || this.get('selectedCategory');

    if (category === 'Other')
      category = null;

    // Is this a new file?
    if (e.dataTransfer && e.dataTransfer.files) {
      console.log(category + ' ' + includePurchase);

      this.set('isDragging', false);
      this.get('controller').send('addFiles', e.dataTransfer.files, category, includePurchase);

      return;
    }

    // Just updating current file
    if (ui) {
      var record_id = ui.draggable.data('attachment-id');

      if (isEmpty(record_id))
        return;

      this.get('controller').send('updateAttachment', record_id, category, includePurchase);
      ui.draggable.slideUp();
    }
  }
});
