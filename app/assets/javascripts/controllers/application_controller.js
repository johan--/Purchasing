
App.ApplicationController = Ember.Controller.extend({

  notifications: null,
  notificationTimer: null,

  clearNotifications: function() {
    this.set('notifications', null);
  },

  // Save notification
  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    var self = this,
        current_notices = this.get('notifications'),
        notices = current_notices || [];

    clearInterval(this.notificationTimer);

    notices.push(notification);
    this.set('notifications', notices);

    this.notificationTimer = setTimeout(function(){ self.clearNotifications(); }, 10000);
  },

  notifyWithJSON: function(errors) {
    var self = this;

    $.each(errors.responseJSON, function(key, value){
      self.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
    });
  }
});

