
// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember
App.NotificationView = Ember.View.extend({
  templateName: 'views/notificationContainer',
  id: 'notificationBox',
  notificationsBinding: 'notifications',

  notificationDidChange: function() {
    console.log('view saw notificatoins');
    if (!Ember.isEmpty(this.get('notifications')))
      this.$().hide().fadeIn();
    return false;
  }.property('notifications'),

  actions: {
    closeNotice: function() {
      self = this;
      this.fadeoutNotification($('.notificationCell'), self);
    }
  },

  fadeoutNotification: function(elements, self) {
    setTimeout(function(){
      self.get('controller').clearNotifications();
    }, (elements.length+1) * 350 );
    elements.each(function(index, element){
      setTimeout(function(){ $(element).fadeOut('fast'); }, index * 350);
    });
  }
});
