
App.EmailView = Ember.View.extend({

  templateName: 'purchase/email/form',

  to: null,
  cc: null,
  subject: null,
  body: null,

  cannedMessages: function() {
    return this.get('controller.store').all('cannedMessage');
  }.property(),


  attachments: function() {
    var content = this.get('controller.model.attachments'),
        model_id = this.get('controller.model.id');

    return content.filter(function(item) {
      return item.get('purchase_id_server') == model_id; // use coercion
    });
  }.property('controller.model.attachments.@each.purchase_id_server'),


  selectedAttachments: function() {
    return this.get('attachments').filterBy('isSelected').map(function(item) { return item.id; });
  }.property('attachments.@each.isSelected'),


  emailURL: function() {
    var id = this.get('controller.model.id');
    return App.getUrl('/purchases/' + id + '/email');
  }.property('controller.model.id'),


  didInsertElement: function() {
    var self = this;

    this.$('.modal').on('show.bs.modal', function(e) {
      var to = self.get('controller.model.requester.email');

      self.set('to', to);
      self.get('attachments').filterBy('isSelected').setEach('isSelected', false);
      self.get('attachments').filterBy('category', 'Requisition').setEach('isSelected', true);
    });

    this.$('.modal').on('hide.bs.modal', function(e) {
      self.get('attachments').filterBy('isSelected').setEach('isSelected', false);
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

      if (isEmpty(this.get('to')) || isEmpty(this.get('subject')) || isEmpty(this.get('body'))) {
        this.get('controller.application').notify('To, Subject, and Body are all required');
        return;
      }

      if (this.get('controller').send('sendEmail', url, formData))
        this.$('.modal').modal('hide');
    },


    updateEmailMessageWithCan: function(message) {
      this.set('subject', message.get('subject'));
      this.set('body', message.get('text'));
      this.set('to', this._getItemFromFlag(message.get('default_to')));
      this.set('cc', this._getItemFromFlag(message.get('default_cc')));
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
