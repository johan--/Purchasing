App.PurchasesController = Ember.ArrayController.extend(App.MetaDataMixin, App.PurchasesControllerMixin, {

  canTabNew:    function() { return this.canTab('New');     }.property('metadata'),
  canTabPending:    function() { return this.canTab('Pending');     }.property('metadata'),
  canTabCancelled:   function() { return this.canTab('Cancelled');  }.property('metadata'),
  canTabReconciled: function() { return this.canTab('Reconciled');  }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata').tab == tab;
  },

  numSelected: function() {
    return this.filterBy('isSelected', true).get('length');
  }.property('@each.isSelected'),

  isSelecting: function() {
    return this.get('numSelected') > 0;
  }.property('numSelected'),

  isReconciling: function() {
    return this.get('reconciling');
  }.property('reconciling'),

  isAssigning: function() {
    return this.get('assigning');
  }.property('assigning'),

  shouldShowFilter: function() {
    return !this.get('isReconciling') && !this.get('isAssigning');
  }.property('isReconciling', 'isAssigning'),

  clearSelected: function() {
    this.get('content').filterBy('isSelected').forEach(function(row){
      row.set('isSelected', false);
    });
  },

  selectAll: function() {
    this.get('content').forEach(function(row){
      row.set('isSelected', true);
    });
  },

  stopAllActivities: function() {
    this.set('assigning', false);
    this.set('reconciling', false);
  },

  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },

    startReconciling: function() {
      this.stopAllActivities();
      this.set('reconciling', true);
    },

    startAssigning: function() {
      this.stopAllActivities();
      this.set('assigning', true);
    },

    stopActivities: function() {
      this.stopAllActivities();
      this.clearSelected();
    },

    selectAll: function() {
      this.selectAll();
    },

    selectNone: function() {
      this.clearSelected();
    },

    assignSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.stopAllActivities();

    },

    reconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.stopAllActivities();
      this.reconcileIds(this.getIdsFromRecs(recs), true);
    },

    unreconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.stopAllActivities();
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

    $.post('/purchases/reconcile', { ids: ids, value: value }).then(function() {
      if (value == true)
        self.application.notify({message: 'Records reconciled', type: 'notice'});
      else
        self.application.notify({message: 'Records unreconciled', type: 'notice'});

      self.send('reloadPage');

    }, function(error) {
      $('#reconcileSelected').removeClass('button_down');

      self.application.notifyWithJSON(error);
    });
  }
});
