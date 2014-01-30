
App.PurchasesTabsControllerMixin = Ember.Mixin.create({
  itemController: 'purchase',
  needs: 'application',
  applicationBinding: 'controllers.application',

  queryParams: ['purPage', 'sort', 'direction', 'tab'],

  // Placeholder to trigger update on these fields
  sortProperties: ['starred', 'dateRequested', 'vendor_string', 'buyer', 'requester'],


  sortPropertiesObject: [{ name: 'starred', sortAscending: false, },
                         { name: 'current' }],


  orderBy: function(item1, item2) {
    var self = this,
        result = 0,
        sortProperties = self.get('sortPropertiesObject'),
        sortFunction = self.get('sortFunction');

    sortProperties.forEach(function(property) {
      var propertyName = property.name,
          propertySortAscending = property.sortAscending;

      if (propertyName == 'current') {
        propertyName = self.get('currentSortFieldName') || 'dateRequested';
        propertySortAscending = self.get('currentSortIsAscending');
      }

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


  currentSortFieldName: function() {
    return this.get('metadata.sort');
  }.property('metadata.sort'),


  currentSortIsAscending: function() {
    return this.get('metadata.direction') == 'ASC';
  }.property('metadata.direction'),


  buildPropertyForSort: function(item, propertyName) {
    var itemsProperty = item.get(propertyName);

    // Test if this is a date
    if (propertyName.indexOf('date') > -1) {
      itemsProperty = moment(itemsProperty).unix() || 0;
    }
    // Test if this is a name
    else if (propertyName.indexOf('name') > -1) {
      itemsProperty = item.get(propertyName.replace('name', 'nameLastFirst'));
    }

    return itemsProperty;
  }
});
