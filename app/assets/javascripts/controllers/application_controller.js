
App.ApplicationController = Ember.Controller.extend({

  notifications: null,
  notificationTimer: null,


  clearNotifications: function() {
    if (this.get('notifications'))
      this.set('notifications', null);
    if (this.notificationTimer)
      Ember.run.cancel(this.notificationTimer);
  },


  // Save notification
  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    var self = this,
        current_notices = this.get('notifications'),
        notices = current_notices || [];

    Ember.run.cancel(this.notificationTimer);

    var class_name = null;
    if (notification.type && notification.type === 'error' )
      class_name = 'alert-danger';
    else
      class_name = 'alert-success';

    notices.push(Ember.merge(notification, {className: class_name }));
    this.set('notifications', notices);

    // Don't schedule a timer if we're in test mode
    if (!Ember.testing)
      this.notificationTimer = Ember.run.later(self, function(){ self.clearNotifications(); }, 10000);
  },


  notifyWithJSON: function(errors) {
    var self = this;

    $.each(errors.responseJSON, function(key, value){
      self.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
    });
  }
});
