
App.AttachmentsDropableView = Ember.View.extend({

  isDragging: false,

  dragEnter: function(e) {
    console.log('enter');
    this.set('isDragging', true);
    this.cancelIt(e);
  },

  dragLeave: function(e) {
    console.log('leave');
    this.set('isDragging', false);
    this.cancelIt(e);
  },

  drag: function() {
    console.log('drag');
    this.cancelIt(e)
  },

  drop: function(e) {
    var data = e.dataTransfer;

    this.set('isDragging', false);
    this.cancelIt();
    this.get('controller').send('addFiles', data.files);
  },

  cancelIt: function(e) {
    e.preventDefault();
  },

})
