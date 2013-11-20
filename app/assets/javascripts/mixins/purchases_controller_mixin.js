
App.PurchasesControllerMixin = Ember.Mixin.create({

  itemController: 'purchase',
  needs: 'application',
  applicationBinding: 'controllers.application',

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
    startSearch: function(val) {
      var old_val = this.get('metadata.lines');

      if (val != old_val && !Ember.isEmpty(val))
        this.transitionToRoute('search', { queryParams: { lines: val } });
    },

    startAdvancedSearch: function(vals) {
      this.transitionToRoute('search', { queryParams: vals });
    },
  },
});
