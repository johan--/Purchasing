// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember

App.NotificationView = Ember.View.extend({
  templateName: 'notificationContainer',

  notificationDidChange: function() {
    console.log('hit');
    if (this.get('notification') !== null) {
      this.$().slideDown();
    }
  }.observes('notification'),

  close: function() {
    this.$().slideUp().then(function() {
      self.set('notification', null);
    });
  }
  // Use CLICK to?

  //template: Ember.Handlebars.compile("<div {{bind-attr class='notificationType'}}>{{view.notification}}" +
    //                                 "<div id='close_obj' {{action 'close' target='view'}}>X</div></div>")
});
