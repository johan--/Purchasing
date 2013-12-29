
App.Router.map(function() {
  this.resource('purchases', { queryParams: ['purPage', 'sort', 'direction', 'tab', 'mode' ] }, function() {
    this.route('tabs', { queryParams: ['purPage', 'sort', 'direction', 'tab', 'mode' ] });
  });
  this.resource('purchase.edit', { path: '/purchases/:purchase_id/edit' });
  this.resource('purchase.show', { path: '/purchases/:purchase_id/show' });
  this.resource('purchase.new', { path: '/purchases/new' });

  this.resource('search', { queryParams: ['searchPage', 'quickSearch', 'requester', 'buyer',
                                          'lines', 'dateRequested', 'datePurchased', 'dateExpected',
                                          'vendor', 'filterBuyer', 'sort', 'direction']
  });

  this.resource('vendors', { queryParams: ['vendPage', 'vendSearch', 'letter'] });
  this.resource('vendor', { path: '/vendors/:vendor_id' }, function() {
    this.route('edit');
  });

  this.resource('users', { queryParams: ['userPage', 'userSearch'] });
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
