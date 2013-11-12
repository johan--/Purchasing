App.PurchasesController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'purchase',
  needs: 'application',
  applicationBinding: "controllers.application",

  canTabPending:    function() { return this.canTab('Pending');     }.property('metadata'),
  canTabCancelled:   function() { return this.canTab('Cancelled');  }.property('metadata'),
  canTabReconciled: function() { return this.canTab('Reconciled');  }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata').tab == tab;
  },

  sortDate:         function(){ return this.findSort('date');       }.property('metadata'),
  sortVendor:       function(){ return this.findSort('vendor');     }.property('metadata'),
  sortRequester:    function(){ return this.findSort('requester');  }.property('metadata'),
  sortDepartment:   function(){ return this.findSort('department'); }.property('metadata'),
  sortBuyer:        function(){ return this.findSort('buyer');      }.property('metadata'),
  findSort: function(field) {
    return this.get('metadata').sort == field;
  },

  sortDescending: function(){
    if (this.get('metadata').direction == 'DESC')
      return 'fa fa-sort-down fa-stack-1x';
    else
      return 'fa fa-sort-up fa-stack-1x';
  }.property('metadata'),

  selectedItems: function() {
    return this.filterBy('isSelected', true).get('length') > 0;
  }.property('@each.isSelected'),

  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },

    startSearch: function(val) {
      var old_val = this.get('metadata.lines');

      if (val != old_val && !Ember.isEmpty(val))
        this.transitionToRoute('search', { queryParams: { lines: val } });
    },

    startAdvancedSearch: function(vals) {
      this.transitionToRoute('search', { queryParams: vals });
    },

    reconcileSelected: function() {
      // TODO
    },

    reconcileAll: function() {
      // TODO
    }
  }
});
