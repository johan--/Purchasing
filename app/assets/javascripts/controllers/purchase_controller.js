App.PurchaseController = Ember.ObjectController.extend({
  needs:['application'],
  applicationBinding: "controllers.application",

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
      console.log(test);

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.application.closeNotifications();
        record.deleteRecord();
        record.save().then(function() {
          this.application.notify({ message: 'Record deleted', type: 'notice' });
          this.transitionToRoute('purchases.index');
        }, function(error){
          record.rollback();
          if (error.status == 422) {
            this.application.notify({ message: 'There was an error deleting the record: ' + jQuery.parseJSON(error.responseText), type: 'error' });
          } else {
            this.application.notify({ message: 'There was an error deleting the record: ' + error.responseText, type: 'error' });
          }
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
      this.application.closeNotifications();

      $.post('/purchases/star/' + record.id)
        .done(function(data) {
          this.application.notify({ message: 'Star updated', type: 'notice' });
          record.reload();
      }, function(error) {
          this.application.notify({ message: 'Failed to update Star: ' + error.responseText, type: 'error' });
      });

      return false;
    }
  },

});
