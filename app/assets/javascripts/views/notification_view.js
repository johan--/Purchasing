
// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember
App.NotificationView = Ember.View.extend({
  templateName: 'views/notificationContainer',
  id: 'notificationBox',
  notificationsBinding: 'notifications',

  notificationDidChange: function() {
    console.log('hi');
    if (!Ember.isEmpty(this.get('notifications')))
      this.$().hide().fadeIn();
    return false;
  }.observes('notifications'),

  actions: {
    closeNotice: function() {
      this.fadeoutNotification($('.notificationCell'), this);
    }
  },

  fadeoutNotification: function(elements, self) {
    setTimeout(function(){
      self.get('controller.application').clearNotifications();
    }, (elements.length+1) * 350 );
    elements.each(function(index, element){
      setTimeout(function(){ $(element).fadeOut('fast'); }, index * 350);
    });
  }
});
