
App.Router.map(function() {
  this.resource('purchases',
                { queryParams: ['purPage', 'sort', 'direction', 'filterBuyer', 'tab',
                                'filterMinDate', 'filterMaxDate', 'filterReceiving',
                                'filterPending', 'filterVendor', 'mode' ] }, function() {
    this.route('tabs');
  });
  this.resource('purchase.edit',
                { path: '/purchases/:purchase_id' }
  );
  this.resource('purchase.new',
                { path: '/purchases/new' }
  );

  this.resource('search',
                { queryParams: ['searchPage', 'quickSearch', 'requester', 'buyer',
                                'lines', 'dateRequested', 'datePurchased', 'dateExpected',
                                'vendor', 'filterBuyer', 'sort', 'direction',
                                'filterMinDate', 'filterMaxDate', 'filterReceiving',
                                'filterPending', 'filterVendor'] }
  );

  this.resource('vendors',
                { queryParams: ['vendPage', 'vendSearch', 'letter'] }
  );
  this.resource('vendor',
                { path: '/vendors/:vendor_id' },
                function() {
                  this.route('edit');
                }
  );

  this.resource('users',
                { queryParams: ['userPage', 'userSearch'] }
  );


  // TODO:   (included so menu works)
  this.resource('settings');
  this.resource('reports');
  this.resource('logout');


});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
