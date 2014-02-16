
App.AttachmentFileDroppableMixin = Ember.Mixin.create({

  // Variables to pass in
  items: null,
  category: null,
  selectedCategory: null,

  // Flags
  includePurchase: null,
  isDragging: false,


  dragEnter: function(e) {
    if (App.current_user.get('is_buyer')) {
      this.cancelEvents(e);
      this.set('isDragging', true);
    }
  },


  dragLeave: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', false);
  },


  dragOver: function(e) {
    if (App.current_user.get('is_buyer')) {
      this.cancelEvents(e);
      this.set('isDragging', true);
    }
  },


  drop: function(e, ui) {
    if (App.current_user.get('is_buyer')) {
      this.cancelEvents(e);
      this._dropNewFile(e, ui);
    }
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

    if (e.dataTransfer && e.dataTransfer.files) {
      this.set('isDragging', false);
      this.get('controller').send('addFiles', e.dataTransfer.files, category, includePurchase);

      return;
    }
  }
});
