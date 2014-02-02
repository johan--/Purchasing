
App.AttachmentsDroppable = Ember.View.extend({

  classNames: ['attachments_box'],
  classNameBindings: ['isDragging'],
  items: null,

  template: Ember.Handlebars.compile('{{#each view.items}}{{view App.AttachmentView}}{{/each}}'),


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
    console.log('drop');
    /*
    if (e.dataTransfer && e.dataTransfer.files) {
      var category = this.get('category');
      if (category === 'Other')
        category = null;

      this.set('isDragging', false);
      this.get('controller').send('addFiles', e.dataTransfer.files, category);
    }
    */
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
        console.log('drop')
        /*
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
        */
      }
    });

  },


});
