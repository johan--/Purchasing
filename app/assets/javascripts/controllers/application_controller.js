
App.ApplicationController = Ember.Controller.extend({

  notifications: null,
  notificationTimer: null,

  clearNotifications: function() {
    this.set('notifications', null);
    Ember.run.cancel(this.notificationTimer);
  },

  // Save notification
  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    var self = this,
        current_notices = this.get('notifications'),
        notices = current_notices || [];

    Ember.run.cancel(this.notificationTimer);

    notices.push(notification);
    this.set('notifications', notices);

    this.notificationTimer = Ember.run.later(self, function(){ self.clearNotifications(); }, 10000);
  },

  notifyWithJSON: function(errors) {
    var self = this;

    $.each(errors.responseJSON, function(key, value){
      self.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
    });
  }
});
