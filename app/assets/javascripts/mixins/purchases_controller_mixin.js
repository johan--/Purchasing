
App.PurchasesControllerMixin = Ember.Mixin.create({
  itemController: 'purchase',
  needs: 'application',
  applicationBinding: 'controllers.application',

  queryParams: ['purPage', 'sort', 'direction', 'tab', 'purSearch'],

  // Placeholder to trigger update on these fields
  sortProperties: ['starred', 'dateRequested', 'vendorString', 'buyer', 'requester'],


  sortPropertiesObject: [{ name: 'starred', sortAscending: false, },
                   { name: 'current', sortAscending: 'currentSortIsAscending' }],


  orderBy: function(item1, item2) {
    var self = this,
        result = 0,
        sortProperties = self.get('sortPropertiesObject'),
        sortFunction = self.get('sortFunction');

    sortProperties.forEach(function(property) {
      var propertyName = property.name,
          propertySortAscending = property.sortAscending;

      if (Ember.typeOf(propertySortAscending) == 'string')
        propertySortAscending = self.get(propertySortAscending) || true;
      if (propertyName == 'current')
        propertyName = self.get('currentSortFieldName') || 'dateRequested';

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

    newPage: function(pages) {
      this.newPage(pages);
      return false;
    }
  },


  newPage: function(param) {
    var params = this.getParams(param);
    this.transitionToRoute('purchases.tabs', params);
  },


  getParams: function(param) {
    var metadata = this.get('metadata') || {},
        params = param || {},
        queryParams = {};

    queryParams.purSearch       = params.purSearch     || metadata.purSearch      || null;
    queryParams.purPage         = params.purPage       || metadata.page           || 1;
    queryParams.sort            = params.sort          || metadata.sort           || 'dateRequested';
    queryParams.direction       = params.direction     || metadata.direction      || 'DESC';
    queryParams.tab             = params.tab           || metadata.tab            || 'Pending';

    return { queryParams: queryParams };
  },


  convert_bool: function(bool) {
    if (isEmpty(bool))
      return null;
    return (bool === true) ? 2 : 1;
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
