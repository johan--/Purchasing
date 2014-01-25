
// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember
App.NotificationView = Ember.View.extend({
  templateName: 'views/notificationContainer',
  id: 'notificationBox',

  notificationDidChange: function() {
    if (!isEmpty(this.get('controllers.application.notifications')))
      this.$().hide().fadeIn();
    return false;
  }.observes('controllers.application.notifications')

});
