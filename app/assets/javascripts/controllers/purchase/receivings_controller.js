App.ReceivingsController = Ember.ArrayController.extend({
  itemController: 'receiving',

  allReceived: function() {
    return this.get('purchase.received');
  }.property('purchase.received'),

  isReceiving: function() {
    return !Ember.isEmpty(this.get('currentReceivingDoc'))
  }.property('currentReceivingDoc'),

  isDirty: function() {
    return this.get('currentReceivingDoc.isDirty');
  }.property('currentReceivingDoc.isDirty'),

  currentReceivingDoc: function() {
    return this.get('content.firstObject.purchase.currentReceivingDoc');
  }.property('content.firstObject.purchase.currentReceivingDoc'),

  actions: {
    cancelReceiving: function() {
      if (!this.confirmRollback())
        return;
      this.set('content.firstObject.purchase.currentReceivingDoc', null);
    },

    newReceiving: function() {
      var new_rec = this.store.createRecord('receiving'),
          purchase = this.get('content.firstObject.purchase');

      this.addObject(new_rec);
      purchase.set('currentReceivingDoc', new_rec);
    },

    saveRecord: function() {
      var record = this.get('currentReceivingDoc'),
          self = this;
      this.application.clearNotifications();

      record.save().then(function(){
        self.application.notify({message: 'Record saved', type: 'notice'});
        self.send('closeModal');
      }, function(error){
        $.each(error.responseJSON, function(key, value){
          self.application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });
      });
    },
  },

  confirmRollback: function() {
    var cur_doc = this.get('currentReceivingDoc');

    if (!Ember.isEmpty(cur_doc) && cur_doc.get('isDirty') == true){

      if (confirm('You are currently editing a record.  Okay to undo changes?')) {
        if (Ember.isEmpty(cur_doc.id))
          cur_doc.deleteRecord();
        else
          cur_doc.rollbackWithChildren();

        return true
      } else {
        return false;
      }
    }

    return true
  },

});
