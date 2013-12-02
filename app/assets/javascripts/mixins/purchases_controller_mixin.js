
App.PurchasesControllerMixin = Ember.Mixin.create({

  itemController: 'purchase',
  needs: 'application',
  applicationBinding: 'controllers.application',

  sortProperties: [{ name: 'starred', sortAscending: false, },
                   { name: 'current', sortAscending: 'currentSortIsAscending' }],

  orderBy: function(item1, item2) {
    var self = this,
        result = 0,
        sortProperties = self.get('sortProperties'),
        sortFunction = self.get('sortFunction');

    sortProperties.forEach(function(property) {
      var propertyName = property.name,
          propertySortAscending = property.sortAscending;

      if (Ember.typeOf(propertySortAscending) == 'string')
        propertySortAscending = self.get(propertySortAscending);
      if (propertyName == 'current')
        propertyName = self.get('currentSortFieldName');

      var item1sProperty = self.buildPropertyForSort(item1, propertyName),
          item2sProperty = self.buildPropertyForSort(item2, propertyName);

      if (result === 0) {
        result = sortFunction(item1sProperty, item2sProperty);
        if ((result !== 0) && !propertySortAscending) {
          result *= -1;
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
    return this.get('currentSortFieldName') == field;
  },


  currentSortFieldName: function() {
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
  },

  buildPropertyForSort: function(item, propertyName) {
    var itemsProperty = item.get(propertyName);

    // Test if this is a date
    if (propertyName.indexOf('date') > -1) {
      itemsProperty = moment(itemsProperty).unix();
    }
    // Test if this is a name
    else if (propertyName.indexOf('name') > -1) {
      itemsProperty = item.get(propertyName.replace('name', 'nameLastFirst'));
    }

    return itemsProperty;
  }

});
