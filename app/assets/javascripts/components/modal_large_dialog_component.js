
App.ModalLargeDialogComponent = Ember.Component.extend({
  action: 'close',

  didInsertElement: function() {
    var self = this;

    this.$('.modal').on('hide.bs.modal', function(e){
      e.preventDefault(); // Stop propagation so parent can decide if we are really closing
      self.send('close');
    });

    this.$('.modal').modal('show');
  },


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    $('body').removeClass('modal-open');
    this._super();
  },


  actions: {

    close: function() {
      return this.sendAction();
    }
  }
});
