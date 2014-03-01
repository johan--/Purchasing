
App.PurchaseAttachmentsView = Ember.View.extend({
  templateName: 'purchase/attachments/form',

  didInsertElement: function() {
    var self = this;

    this.$('.modal').on('show.bs.modal', function(e) {
      var to = self.get('controller.model.requester.email');

      self.set('to', to);
      self.get('controller').send('selectNone');
    });

    this.$('.modal').on('hide.bs.modal', function(e) {
      self.get('controller').send('selectNone');
    });
  },


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  }
});
