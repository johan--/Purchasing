App.PurchaseController = Ember.ObjectController.extend({

  dateString: function() {
    return moment(this.get('dateRequested')).format('MMM D');
  }.property('dateRequested'),

  vendorString: function() {
    vendors = this.get('vendors')
    if (vendors)
      return this.get('vendors').map(function(v){ return v._data.name; }).join(', ');
  }.property('vendors'),

  actions: {
    // http://discuss.emberjs.com/t/migrating-from-ember-data-0-13-to-1-0-0-beta-1-my-findings/2368
    deleteRecord: function() {

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.get('target').clearNotifications();
        record.deleteRecord();
        record.save().then(function(){
          // TODO: Transition back

        }, function(error){
          record.rollback();
          $.each(error.responseJSON, function(key, value){
            record.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
          });
        });
      }

      return false;
    },

    openRecord: function() {
      record = this.get('model');
      this.transitionToRoute('purchase.edit', record );
      return false;
    },

    starMe: function() {
      record = this.get('model');
      this.get('target').clearNotifications();
      current = this.get('starred');

      if (Ember.isEmpty(current))
        record.set('starred', moment().format());
      else
        record.set('starred', null);

      record.save();
      return false;
    },

    saveRecord: function() {
      var record = this.get('model');
      this.get('target').clearNotifications();

      record.save().then(function(){
        // TODO: Transition back
      }, function(error){
        $.each(error.responseJSON, function(key, value){
          record.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });
      });
    }
  },

});
