App.ControllerNotifiableMixin = Ember.Mixin.create({

  // Grab all notifications from children
  notifications: function() {
    myNotifications = [];
    this.forEach(function(one){
      notification = one.get('notifications');
      if (notification) {
        $.merge(myNotifications, notification);
      }
    });
    return myNotifications;
  }.property('@each.notifications'),

  // Clear each child model's notification
  clearNotifications: function() {
    this.forEach(function(one){
      one.set('notifications', null);
    });
  },

})
