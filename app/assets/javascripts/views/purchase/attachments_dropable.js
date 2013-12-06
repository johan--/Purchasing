
App.AttachmentsDropableView = Ember.View.extend({
  classNames: ['attachments_modal'],
  classNameBindings: ['isDragging'],
  templateName: 'purchase/attachments_dropable_view',

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


  drop: function(e) {
    this.cancelEvents(e);

    this.set('isDragging', false);
    this.get('controller').send('addFiles', e.dataTransfer.files);
  },


  cancelEvents: function(e) {
    e.preventDefault();
    e.stopPropagation();
  }
});
