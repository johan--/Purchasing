App.ModelNotificationMixin = Ember.Mixin.create({
  modelNotification: null,

  // Save notification to this model
  // Format: { message: 'test', type: 'notice'}
  notify: function(notification) {
    current_notices = this.get('modelNotification');
    notices = current_notices || [];
    notices.push(notification);
    this.set('modelNotification', notices);
  },

  didLoad: function() {
    console.log('Record Loaded ' + this.constructor + ' ' + this.id);
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
  becameInvalid:  function(record, error) {
    this.notify({ message: 'Invalid Record: ' + error, type: 'error' });
  },
  becameError:  function(record) {
    console.log('Server error with record ' + record.id);
  }
})
