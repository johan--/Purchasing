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

  isNotReconciling: function() {
    return !this.get('reconciling');
  }.property('reconciling'),

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

  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },

    startReconciling: function() {
      this.set('reconciling', true);
    },

    stopReconciling: function() {
      this.clearSelected();
      this.set('reconciling', false);
    },

    reconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.set('reconciling', false);
      this.reconcileIds(this.getIdsFromRecs(recs), true);
    },

    selectAll: function() {
      this.selectAll();
    },

    selectNone: function() {
      this.clearSelected();
    },

    unreconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');

      this.set('reconciling', false);
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
