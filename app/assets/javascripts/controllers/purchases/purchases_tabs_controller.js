
App.PurchasesTabsController = Ember.ArrayController.extend(App.PurchasesTabsControllerMixin, {

  tab: 'Pending',
  page: '1',


  metadata: function() {
    var metadata = this.store.metadataFor('purchase');
    return metadata;
  }.property('model.isLoaded'),


  numSelected: function() {
    return this.filterBy('isSelected', true).get('length');
  }.property('@each.isSelected'),


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
    this.clearSelected();
  },


  noRecords: function() {
    return this.get('content.length') === 0;
  }.property('content.length'),


  assignSelected: function(buyer_id) {
    var self = this,
        application = this.application,
        recs = this.get('content').filterBy('isSelected');

    if (isEmpty(buyer_id) || buyer_id === 0) {
      application.notify({message: 'Cannot assign records: no buyer selected', type: 'error'});
      return;
    }

    rec_ids = recs.map(function(rec){
      rec.set('isSelected', false);
      return rec.id;
    });

    $.ajax({
      type: 'POST',
      url: App.Globals.namespace + '/purchases/assign',
      data: { ids: rec_ids, user_id: buyer_id }
    }).then(function() {

      application.notify({message: 'Records assigned', type: 'notice'});
      self.send('reloadPage');

    }, function(error) {

      application.notify(error, 'error');

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

    $('#reconcileSelected').addClass('button_down');

    $.ajax({
      type: 'POST',
      url: App.Globals.namespace + '/purchases/reconcile',
      data: { ids: ids, value: value }
    }).then(function() {

      if (value === true)
        application.notify({message: 'Records reconciled', type: 'notice'});
      else
        application.notify({message: 'Records unreconciled', type: 'notice'});

      self.send('reloadPage');

    }, function(error) {

      $('#reconcileSelected').removeClass('button_down');

      application.notify(error, 'error');

    });
  }
});
