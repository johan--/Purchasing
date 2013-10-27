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
    deleteRecord: function(test) {

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.get('target').clearNotifications();
        record.deleteRecord();
        record.save();
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

      if (current == null)
        record.set('starred', moment().format());
      else
        record.set('starred', null);

      record.save();
      return false;
    }
  },

});
