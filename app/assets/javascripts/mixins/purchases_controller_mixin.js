
App.PurchasesControllerMixin = Ember.Mixin.create({

  itemController: 'purchase',
  needs: 'application',
  applicationBinding: 'controllers.application',

  sortObjectProperties: [{ name: 'starred', sortAscending: true, },
                         { name: 'currentSortField', sortAscending: 'currentSortDirection' },
                         { name: 'id', sortAscending: 'currentSortDirection' }],

  orderBy: function(item1, item2) {
    var result = 0,
        sortProperties = get(this, 'sortObjectProperties'),
        sortFunction = get(this, 'sortFunction');

    console.log('ordering');

    forEach(sortProperties, function(property) {
      var propertyName = property.name,
          propertySortAscending = property.sortAscending;

      if (result === 0) {
        result = sortFunction(get(item1, propertyName), get(item2, propertyName));
        if ((result !== 0) && !propertySortAscending) {
          result = (-1) * result;
        }
      }
    });

    return result;
  },

  sortDate:         function(){ return this.findSort('dateRequested');        }.property('metadata'),
  sortVendor:       function(){ return this.findSort('vendorString');         }.property('metadata'),
  sortRequester:    function(){ return this.findSort('requester.name');       }.property('metadata'),
  sortDepartment:   function(){ return this.findSort('requester.department'); }.property('metadata'),
  sortBuyer:        function(){ return this.findSort('buyer.name');           }.property('metadata'),
  findSort: function(field) {
    return this.get('currentSortField') == field;
  },


  currentSortField: function() {
    return this.get('metadata.sort');
  }.property('metadata.sort'),


  currentSortIsAscending: function() {
    return this.get('metadata.direction') == 'ASC';
  }.property('metadata.direction'),


  sortDescending: function(){
    if (this.get('currentSortIsAscending'))
      return 'fa fa-sort-up fa-stack-1x';
    else
      return 'fa fa-sort-down fa-stack-1x';
  }.property('currentSortIsAscending'),


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
