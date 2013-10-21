App.ApplicationController = Ember.Controller.extend({
  closeNotification: function() {
    this.set('notification', null);
  },

  notify: function(notification, type) {
    console.log('application has been notified: ' + notification + ' ' + type);
    this.set('notification', notification);
    this.set('notificationType', type);
  }
});
