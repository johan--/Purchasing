
App.AttachmentCategoryView = Ember.View.extend({
  tagName: 'li',
  classNameBindings: ['active', 'isDragging'],

  template: Ember.Handlebars.compile('<a>{{view.category}}</a>'),


  active: function() {
    var selected = this.get('selectedTab'),
        current = this.get('category');

    this.setDisabled();

    return current === selected;
  }.property('selectedTab'),


  click: function() {
    this.get('parentView').send('setCategoryTab', this.get('category'));
  },


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

    //this.set('isDragging', false);
    //this.get('controller').send('addFiles', e.dataTransfer.files, this.get('content'));


    //console.log(this)
  },


  cancelEvents: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },


  didInsertElement: function() {
    var self = this,
        store = this.get('controller.store'),
        category = this.get('category');

    this.$().droppable({
      hoverClass: 'is-dragging',
      accept: '.attachmentDroppable',
      greedy: true,
      tolerance: 'intersect',

      drop: function(e, ui) {
        var record_id = ui.draggable.data('attachment-id');

        if (isEmpty(record_id))
          return;

        var rec = self.getAttachmentFromID(record_id);

        if (rec) {
          if (category === 'Other')
            rec.updateCategory(null);
          else
            rec.updateCategory(category);
          ui.draggable.slideUp();
        }
      }
    });

    this.set('enabled', true);
    this.setDisabled();
  },


  setDisabled: function() {
    var selected = this.get('selectedTab'),
        current = this.get('category');

    if (!this.get('enabled'))
      return;

    if (selected === current)
      this.$().droppable( 'option', 'disabled', true);
    else
      this.$().droppable( 'option', 'disabled', false);
  },


  getAttachmentFromID: function(id) {
    var store = this.get('controller.store');

    return store.all('attachment').filter(function(rec){
      if (rec.id == id)  // Use coercion!
        return true;
    }).get('firstObject');
  }
});
