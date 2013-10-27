App.NotificationMixin = Ember.Mixin.create({
  notifications: null,

  // Save notification to this model
  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    current_notices = this.get('notifications');
    notices = current_notices || [];
    notices.push(notification);
    this.set('notifications', notices);
  },

  didLoad: function() {
    console.log('Record Loaded ' + this.id);
  },
  didUpdate:  function() {
    this.notify({ message: 'Record Updated: '  + this.id, type: 'notice' });
  },
  didCreate:  function() {
    this.notify({ message: 'Record Created: ' + this.id, type: 'notice' });
  },
  didDelete:  function() {
    this.notify({ message: 'Record Deleted: ' + this.id, type: 'notice' });
  },
  becameInvalid:  function(error, a, b) {
    console.log(error);
    console.log(a);
    console.log(b);
        this.notify({ message: 'Invalid Record', type: 'error' });
  },
  becameError:  function(error, a, b) {
    this.notify({ message: 'Server error with record ' + this.id, type: 'error' });
  }
})
