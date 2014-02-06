
// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember
App.NotificationView = Ember.View.extend({
  templateName: 'views/notificationContainer',
  id: 'notificationBox',


  actions: {
    closeNotice: function() {
      this.get('controller.application').send('clearNotifications');
    }
  }

});
