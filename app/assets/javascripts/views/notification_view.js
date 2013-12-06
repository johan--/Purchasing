
// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember
App.NotificationView = Ember.View.extend({
  templateName: 'views/notificationContainer',
  id: 'notificationBox',


  notificationDidChange: function() {
    if (!Ember.isEmpty(this.get('controllers.application.notifications')))
      this.$().hide().fadeIn();
    return false;
  }.observes('controllers.application.notifications'),


  actions: {

    closeNotice: function() {
      this.fadeoutNotification($('.notificationCell'), this);
    }
  },


  fadeoutNotification: function(elements, self) {
    Ember.run.later(self, function(){
      self.get('controller.application').clearNotifications();
    }, (elements.length+1) * 350 );

    elements.each(function(index, element){
      Ember.run.later(self, function(){ $(element).fadeOut('fast'); }, index * 350);
    });
  }
});
