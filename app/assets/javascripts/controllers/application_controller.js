
App.ApplicationController = Ember.Controller.extend({

  notifications: null,

  clearNotifications: function() {
    this.set('notifications', null);
  },

  // Save notification
  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    var current_notices = this.get('notifications'),
        notices = current_notices || [];
    notices.push(notification);
    this.set('notifications', notices);
  },

  notifyWithJSON: function(errors) {
    var self = this;

    $.each(errors.responseJSON, function(key, value){
      self.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
    });
  }
});

