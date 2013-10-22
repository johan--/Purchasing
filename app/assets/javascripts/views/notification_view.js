// Modified from http://stackoverflow.com/questions/14288980/global-notifications-view-using-ember

App.NotificationView = Ember.View.extend({
  templateName: 'notificationContainer',

  notificationDidChange: function() {
    if (this.get('notifications') !== null)
      this.$().hide().fadeIn();
    return false;
  }.observes('notifications'),

  actions: {
    closeNotice: function() {
      this.fadeoutNotification($('.notificationCell'));
    }
  },

  fadeoutNotification: function(elements) {
    parent = this;
    setTimeout(function(){ parent.get('controller').closeNotifications(); }, (elements.length+1) * 350 );
    elements.each(function(index, element){
      setTimeout(function(){ $(element).fadeOut('fast'); }, index * 350);
    });
  }
});

// Model level:
// https://gist.github.com/niklas/3981832
