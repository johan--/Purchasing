
App.Router.map(function() {
  this.resource('purchases',
                { queryParams: ['purPage', 'sort', 'direction', 'buyer', 'tab',
                                'filterMinDate', 'filterMaxDate', 'filterReceiving',
                                'filterPending', 'vendor', 'mode' ] }
  );
  this.resource('purchase.edit',
                { path: '/purchases/:purchase_id' }
  );
  this.resource('purchase.new',
                { path: '/purchases/new' }
  );

  this.resource('search',
                { queryParams: ['searchPage', 'lines', 'sort', 'direction', 'filterMinDate',
                                'filterMaxDate', 'filterReceiving', 'filterPending',
                                'vendor', 'requester', 'buyer', 'date_requested',
                                'date_ordered', 'date_expected'] }
  );

  this.resource('vendors',
                { queryParams: ['vendPage', 'search', 'letter'] }
  );
  this.resource('vendor',
                { path: '/vendors/:vendor_id' },
                function() {
                  this.route('edit');
                }
  );

  this.resource('users',
                { queryParams: ['userPage', 'search'] }
  );


  // TODO:   (included so menu works)
  this.resource('settings');
  this.resource('reports');
  this.resource('logout');


});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
