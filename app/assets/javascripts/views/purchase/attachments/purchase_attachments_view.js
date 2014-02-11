
App.PurchaseAttachmentsView = Ember.View.extend({
  templateName: 'purchase/attachments/form',

  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  }
});
