
App.ModalDialogComponent = Ember.Component.extend({


  didInsertElement: function() {
    var self = this;

    this.$('.modal').on('hide.bs.modal', function(e){
      self.send('close');
    });

    this.$('.modal').modal('show');
  },


  willDestroyElement: function() {
    this.$('.modal').modal('destroy');
  },


  actions: {

    close: function() {
      return this.sendAction();
    }
  }
});
