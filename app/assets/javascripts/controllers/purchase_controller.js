App.PurchaseController = Ember.ObjectController.extend({
  needs:['application'],

  vendor_string: function() {
    return this.get('vendors').map(function(v){ return v._data.name; }).join(', ');
  }.property('vendors'),

  actions: {
    deleteRecord: function() {
      this.get('controllers.application').notify('test', 'notice');
      return false;

      if (confirm('This will permanentaly delete this record.  Okay to delete?')) {
        var record = this.get('model');
        record.deleteRecord();
        record.save().then(function() {
          notify('Record deleted', 'notice');
        }).fail(function(){
          record.rollback();
          notify('There was an error deleting the record', 'error');
        });
      }

      return false;
    },

    openRecord: function() {
      record = this.get('model');
      this.transitionToRoute('purchase', { id: record.id } );
      return false;
    }
  }
});
