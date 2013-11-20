App.PurchasesController = Ember.ArrayController.extend(App.MetaDataMixin, App.PurchasesControllerMixin, {

  canTabPending:    function() { return this.canTab('Pending');     }.property('metadata'),
  canTabCancelled:   function() { return this.canTab('Cancelled');  }.property('metadata'),
  canTabReconciled: function() { return this.canTab('Reconciled');  }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata').tab == tab;
  },

  selectedItems: function() {
    return this.filterBy('isSelected', true).get('length') > 0;
  }.property('@each.isSelected'),

  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },

    reconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.reconcileIds(this.getIdsFromRecs(recs), true);
    },

    selectAll: function() {
      this.get('content').forEach(function(row){
        row.set('isSelected', true);
      });
    },

    selectNone: function() {
      this.get('content').filterBy('isSelected').forEach(function(row){
        row.set('isSelected', false);
      });
    },

    unreconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.reconcileIds(this.getIdsFromRecs(recs), false);
    },
  },

  getIdsFromRecs: function(recs) {
    var ids = [];

    recs.forEach(function(rec){
      rec.set('isSelected', false);
      ids.push(rec.id);
    });

    return ids
  },

  reconcileIds: function(ids, value) {
    var self = this;

    this.application.clearNotifications();

    $('#reconcileSelected').addClass('button_down');
    $('#reconcileAll').addClass('button_down');

    $.post('/purchases/reconcile', { ids: ids, value: value }).then(function() {
      if (value == true)
        self.application.notify({message: 'Records reconciled', type: 'notice'});
      else
        self.application.notify({message: 'Records unreconciled', type: 'notice'});

      self.send('reloadPage');

    }, function(error) {
      $('#reconcileSelected').removeClass('button_down');
      $('#reconcileAll').removeClass('button_down');

      self.application.notifyWithJSON(error);
    });
  }
});
