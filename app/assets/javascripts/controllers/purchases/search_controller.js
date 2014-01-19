
App.SearchController = Ember.ArrayController.extend(App.PurchasesControllerMixin, {

  queryParams: ['vendor', 'requester', 'buyer', 'dateRequestedMin', 'dateRequestedMax',
                'datePurchasedMin', 'datePurchasedMax', 'dateExpectedMin', 'dateExpectedMax',
                'lines', 'searchPage', 'quickSearch', 'sort', 'direction'],

  metadata: function() {
    return this.get('content.meta');
  }.property('content.meta'),


  foundCount: function() {
    var metadata = this.get('metadata');

    if (!Ember.isEmpty(metadata))
      return this.get('metadata').found_count || 0;
    else
      return 0;
  }.property('metadata'),


  foundRange: function() {
    var metadata = this.get('metadata'),
        page = metadata.page || 1,
        per_page = metadata.per_page || 15,
        min = ((page - 1) * per_page),
        max = min + per_page;

    return (min + 1) + ' / ' + max;

  }.property('metadata')
});
