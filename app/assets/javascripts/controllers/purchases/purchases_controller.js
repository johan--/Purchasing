App.PurchasesController = Ember.ArrayController.extend(App.MetaDataMixin, App.PurchasesControllerMixin, {

  canTabNew:        function() { return this.canTab('New');        }.property('metadata'),
  canTabPending:    function() { return this.canTab('Pending');    }.property('metadata'),
  canTabPurchased:  function() { return this.canTab('Purchased');  }.property('metadata'),
  canTabCancelled:  function() { return this.canTab('Cancelled');  }.property('metadata'),
  canTabReconciled: function() { return this.canTab('Reconciled'); }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata').tab == tab;
  },


  numSelected: function() {
    return this.filterBy('isSelected', true).get('length');
  }.property('@each.isSelected'),


  itemsSelected: function() {
    return this.get('numSelected') > 0;
  }.property('numSelected'),


  isReconciling: function() {
    return this.get('reconciling');
  }.property('reconciling'),


  isAssigning: function() {
    return this.get('assigning');
  }.property('assigning'),


  isSelecting: function() {
    return this.get('isReconciling') || this.get('isAssigning');
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
    this.clearSelected();
    $('.ui-tooltip').remove(); // Tooltips sometimes get stuck when changing modes
  },


  noRecords: function() {
    return this.get('content.length') === 0;
  }.property('content.length'),


  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },


    startReconciling: function() {
      var curReconciling = this.get('isReconciling');
      this.stopAllActivities();

      if (curReconciling !== true)
        this.set('reconciling', true);
    },


    startAssigning: function() {
      var curAssigning = this.get('isAssigning');
      this.stopAllActivities();

      if (curAssigning !== true)
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
      var self = this,
          application = this.application,
          recs = this.get('content').filterBy('isSelected'),
          buyer_id = this.get('assignBuyer');

      if (buyer_id === null || buyer_id === 0) {
        application.notify({message: 'Cannot assign records: no buyer selected', type: 'error'});
        return;
      }

      rec_ids = recs.map(function(rec){
        rec.set('isSelected', false);
        return rec.id;
      });

      $.post('/purchases/assign', { ids: rec_ids, user_id: buyer_id }).then(function() {
        application.notify({message: 'Records assigned', type: 'notice'});
        self.send('reloadPage');

      }, function(error) {
        application.notifyWithJSON(error);
      });
    },


    reconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');
      this.reconcileIds(this.getIdsFromRecs(recs), true);
    },


    unreconcileSelected: function() {
      var recs = this.get('content').filterBy('isSelected');
      this.reconcileIds(this.getIdsFromRecs(recs), false);
    },
  },


  getIdsFromRecs: function(recs) {
    return recs.reduce(function(ids, rec){
      rec.set('isSelected', false);
      ids.push(rec.id);
      return ids;
    }, []);
  },


  reconcileIds: function(ids, value) {
    var self = this,
        application = this.application;

    application.clearNotifications();

    $('#reconcileSelected').addClass('button_down');

    $.post('/purchases/reconcile', { ids: ids, value: value }).then(function() {
      if (value === true)
        application.notify({message: 'Records reconciled', type: 'notice'});
      else
        application.notify({message: 'Records unreconciled', type: 'notice'});

      self.send('reloadPage');

    }, function(error) {
      $('#reconcileSelected').removeClass('button_down');

      application.notifyWithJSON(error);
    });
  }
});
