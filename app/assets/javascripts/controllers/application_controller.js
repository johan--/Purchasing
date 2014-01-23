
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
  notify: function(notification, defaultType) {
    var self = this,
        notices = [];

    defaultType = defaultType || 'error';

    this.clearNotifications();
    Ember.run.cancel(this.notificationTimer);

    notification = self.parseObjectsFromNotice(notification, defaultType);

    if (Ember.typeOf(notification) === 'array' ) {
      $.each(notification, function(index, item){
        self.addNotice(notices, item);
      });
    } else {
      self.addNotice(notices, notification);
    }

    self.set('notifications', notices);
    self.setTimer();
  },


  // responseText should just be a string
  // responseJSON should be an object with key/value pairs
  parseObjectsFromNotice: function(notification, defaultType) {
    var objects = null;

    if (Ember.tryGet(notification, 'responseText')) {
      return { message: notification.responseText, type: defaultType };

    } else if (Ember.tryGet(notification, 'responseJSON')) {
      var response = [];

      $.each(notification.responseJSON, function(key, value){
        response.push({ message: key.capitalize() + ': ' + value, type: defaultType });
      });

      return response;

    } else {
      return notification;
    }
  },


  addNotice: function(notifications, notice) {
    var self = this,
        class_name = self.getClass(notice.type);

    console.log('A ' + notice.type + ' notification was sent: ' + notice.message);
    console.log(notice.message);

    notifications.push(Ember.merge(notice, { className: class_name }));
  },


  setTimer: function() {
    // Don't schedule a timer if we're in test mode
    if (!Ember.testing)
      this.notificationTimer = Ember.run.later(self, function(){ self.clearNotifications(); }, 10000);
  },


  getClass: function(noticeType) {
    return (noticeType && noticeType === 'error') ? 'alert-danger' : 'alert-success';
  }

});
