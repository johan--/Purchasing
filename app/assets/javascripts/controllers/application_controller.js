App.ApplicationController = Ember.Controller.extend({

  closeNotifications: function() {
    this.set('notifications', null);
  },

  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    current_notices = this.get('notifications');
    notices = current_notices || [];
    notices.push(notification);
    this.set('notifications', notices);
  }
});
