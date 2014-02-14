
App.EmailView = Ember.View.extend({
  templateName: 'purchase/email/form',

  cannedMessages: function() {
    return this.get('controller.store').all('cannedMessage');
  }.property(),


  attachments: function() {
    var content = this.get('controller.model.attachments'),
        model_id = this.get('controller.model.id');

    return content.filter(function(item) {
      return item.get('purchase_id_server') == model_id;
    });
  }.property('controller.model.attachments.@each.purchase_id_server'),


  selectedAttachments: function() {
    return this.get('attachments').filterBy('isSelected', true).map(function(item) { return item.id; });
  }.property('attachments.@each.isSelected'),


  emailURL: function() {
    var id = this.get('controller.model.id');
    return App.Globals.namespace + '/purchases/' + id + '/email';
  }.property('controller.model.id'),


  didInsertElement: function() {
    var self = this;

    this.$('.modal').on('show.bs.modal', function(e){
      var to = self.get('controller.model.requester.email');

      if (to)
        self.$('input[name="to"]').val(to);
    });
  },


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  },


  actions: {

    submitEmail: function() {
      var url = this.get('emailURL'),
          formData = $('#emailForm').serialize();

      this.get('controller').send('sendEmail', url, formData);
      this.$('.modal').modal('hide');
    },


    updateEmailMessageWithCan: function(message) {
      this.$('input[name="subject"]').val(message.get('subject'));
      this.$('textarea[name="body"]').val(message.get('text'));

      this.$('input[name="to"]').val(this._getItemFromFlag(message.get('default_to')));
      this.$('input[name="cc"]').val(this._getItemFromFlag(message.get('default_cc')));
    }
  },


  _getItemFromFlag: function(item) {
    var val = null;

    if (isEmpty(item))
      return;

    switch(item) {
      case 'Vendor':
        val = this.get('controller.model.vendors.firstObject.email');
        break;
      case 'Requester':
        val = this.get('controller.model.requester.email');
        break;
    }

    return val;
  }
});
