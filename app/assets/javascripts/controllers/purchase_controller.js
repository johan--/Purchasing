App.PurchaseController = Ember.ObjectController.extend({
  needs:['application'],

  vendor_string: function() {
    return this.get('vendors').map(function(v){ return v._data.name; }).join(', ');
  }.property('vendors'),

  actions: {
    deleteRecord: function() {
      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        this.get('controllers.application').closeNotifications();
        parent = this;

        record.deleteRecord();
        record.save().then(function() {
          parent.get('controllers.application').notify({ message: 'Record deleted', type: 'notice' });
        }).fail(function(){
          record.rollback();
          parent.get('controllers.application').notify({ message: 'There was an error deleting the record', type: 'error' });
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
      })
        .fail(function(data) {
          parent.get('controllers.application').notify({ message: 'Failed to update Star' + record.id, type: 'error' });
      });

      return false;
    }
  }
});
