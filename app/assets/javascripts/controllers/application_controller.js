
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


  actions: {
    clearNotifications: function() { this.clearNotifications(); }
  },


//responseJSON: date_requested: [ 'Date requested cannot be blank']
//responseJSON ['Cannot destroy...']

  // responseText should just be a string
  // responseJSON should be an object with key/value pairs
  parseObjectsFromNotice: function(notification, defaultType) {
    var self = this;

    // If this has a responseJSON key
    if (notification && notification.responseJSON) {
      var responseJSON = notification.responseJSON;

      // If this is already an array just return it
      if (Ember.typeOf(responseJSON) === 'array')
        return responseJSON;

      // Otherwise it is an object
      var responses = [];

      $.each(responseJSON, function(key, value){
        var keyName = Ember.String.humanize(key) + ': ';

        // Check if value is an array (i.e. several validations for one field failed)
        if (Ember.typeOf(value) === 'array')
          $.each(value, function(i, text) { responses.push({ message: keyName + text, type: defaultType }); });
        // Otherwise just parse the value
        else
          responses.push({ message: keyName + value, type: defaultType });
      });

      return responses;

    // If this has a responseText key
    } else if (notification && notification.responseText) {
      return { message: notification.responseText, type: defaultType };

    // Otherwise try to just stringify it
    } else {
      return notification;
    }
  },


  addNotice: function(notifications, notice) {
    var class_name = this.getClass(notice.type || 'error');

    notifications.push(Ember.merge(notice, { className: class_name }));
  },


  setTimer: function() {
    var self = this;

    // Don't schedule a timer if we're in test mode
    if (!Ember.testing)
      this.notificationTimer = Ember.run.later(self, function(){ self.clearNotifications(); }, 10000);
  },


  getClass: function(noticeType) {
    return (noticeType && noticeType === 'notice') ? 'alert-success' : 'alert-danger';
  },


  willDestroy: function() {
    this.clearNotifications();
  }

});
