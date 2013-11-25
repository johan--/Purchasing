
App.PurchasesControllerMixin = Ember.Mixin.create({

  itemController: 'purchase',
  needs: 'application',
  applicationBinding: 'controllers.application',

  sortProperties: ['starred'],
  sortAscending: false,

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

      console.log(val);

      var old_val = this.get('metadata.quickSearch'),
          params = this.clearParams({ quickSearch: val });

      if (val != old_val && !Ember.isEmpty(val))
        this.transitionToRoute('search', { queryParams: params });
    },

    startAdvancedSearch: function(vals) {
      var params = this.clearParams(vals);
      this.transitionToRoute('search', { queryParams: params });
    },
  },

  clearParams: function(vals) {
    var params = {
      quickSearch: vals.quickSearch || null,
      vendor: vals.vendor || null,
      requester: vals.requester || null,
      buyer: vals.buyer || null,
      dateRequested: vals.dateRequested || null,
      datePurchased: vals.datePurchased || null,
      dateExpected: vals.dateExpected || null,
      lines: vals.lines || null,
      searchPage: vals.page || 1
    };

    // Filters
    params.sort = params.direction = params.filterMinDate =
                  params.filterMaxDate = params.filterReceiving =
                  params.filterPending = params.filterVendor = null;

    return params;
  }




});
