App.ControllerNotifiableMixin = Ember.Mixin.create({

  // Grab all notifications from children
  notifications: function() {
    myNotifications = [];
    self = this;

    if (Ember.isArray(this)) {
      this.forEach(function(one){
        self.getOneNotification(myNotifications, one);
      });
    } else {
      this.getOneNotification(myNotifications, this);
    }

    return myNotifications;
  }.property('@each.modelNotification', 'modelNotification'),

  // Clear each child model's notification
  clearNotifications: function() {
    self = this;

    if (Ember.isArray(this)) {
      this.forEach(function(one){
        self.clearOneNotification(one);
      });
    } else {
      this.clearOneNotification(this);
    }
  },

  clearOneNotification: function(one) {
    return one.set('modelNotification', null);
  },

  getOneNotification: function(result, one) {
    notification = one.get('modelNotification');
    if (notification) {
      $.merge(result, notification);
    }
  }
})
