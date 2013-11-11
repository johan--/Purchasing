
App.Router.map(function() {
  this.resource('purchases',
                { queryParams: ['purPage', 'sort', 'direction', 'buyer', 'tab',
                                'filterMinDate', 'filterMaxDate', 'filterReceiving',
                                'filterPending'] }
  );
  this.resource('purchase.edit',
                { path: '/purchases/:purchase_id' }
  );
  this.resource('purchase.new',
                { path: '/purchases/new' }
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

  // TODO:   (included so menu works)
  this.resource('tags');
  this.resource('users');
  this.resource('settings');
  this.resource('reports');
  this.resource('logout');


});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
