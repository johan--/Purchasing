App.PurchasesController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'purchase',
  needs: 'application',
  applicationBinding: "controllers.application",

  canTabPending:    function() { return this.canTab('Pending');     }.property('metadata'),
  canTabReceived:   function() { return this.canTab('Received');    }.property('metadata'),
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

  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },

    startSearch: function(val) {
      console.log('searching for: ' + val);
    }
  }
});
