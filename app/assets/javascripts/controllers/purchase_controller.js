App.PurchaseController = Ember.ObjectController.extend({
  needs:['application'],

  date_string: function() {
    return moment(this.get('date_requested')).format('MMM D');
  }.property('date_string'),

  vendor_string: function() {
    return this.get('vendors').map(function(v){ return v._data.name; }).join(', ');
  }.property('vendors'),

  actions: {
    // http://discuss.emberjs.com/t/migrating-from-ember-data-0-13-to-1-0-0-beta-1-my-findings/2368
    deleteRecord: function(test) {
      console.log(test);

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.get('controllers.application').closeNotifications();
        parent = this;

        record.deleteRecord();
        record.save().then(function() {
          parent.get('controllers.application').notify({ message: 'Record deleted', type: 'notice' });
          this.transitionToRoute('purchases.index');
        }, function(error){
          record.rollback();
          if (error.status == 422) {
            parent.get('controllers.application').notify({ message: 'There was an error deleting the record: ' + jQuery.parseJSON(error.responseText), type: 'error' });
          } else {
            parent.get('controllers.application').notify({ message: 'There was an error deleting the record: ' + error.responseText, type: 'error' });
          }
        });
      }

      return false;
    },

    openRecord: function() {
      record = this.get('model');
      this.transitionToRoute('purchase', { id: record.id } );
      return false;
    },

    starMe: function() {
      record = this.get('model');
      parent = this;
      this.get('controllers.application').closeNotifications();

      $.post('/purchases/star/' + record.id)
        .done(function(data) {
          parent.get('controllers.application').notify({ message: 'Star updated', type: 'notice' });
          record.reload();
      }, function(error) {
          parent.get('controllers.application').notify({ message: 'Failed to update Star: ' + error.responseText, type: 'error' });
      });

      return false;
    }
  }
});
