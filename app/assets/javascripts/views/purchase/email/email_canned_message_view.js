
App.EmailCannedMessageView = Ember.TextField.extend({

  classNames: ['form-control'],
  type: 'radio',
  name: 'canned_message',

  valueObserver: function() {
    var item = this.get('content'),
        controller = this.get('parentView');

    controller.send('updateEmailMessageWithCan', item);
  }.observes('value')
});
