
App.EmailView = Ember.View.extend({
  templateName: 'purchase/email/form',

  cannedMessages: ['Place Order', 'Request Status', 'Notify Requester', 'Email Receipt', 'Request receiving status'],


  attachments: function() {
    var content = this.get('controller.model.attachments'),
        model_id = this.get('controller.model.id');

    return content.filter(function(item) {
      if (item._data.purchase && (item._data.purchase.id == model_id))
        return true;
    });
  }.property('controller.model.attachments.@each.purchase'),


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  }
});
