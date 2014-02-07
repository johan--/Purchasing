
App.Router.map(function() {
  this.resource('purchases', function() {
    this.route('tabs');
  });
  this.resource('purchase.edit', { path: '/purchases/:purchase_id/edit' });
  this.resource('purchase.show', { path: '/purchases/:purchase_id/show' });
  this.resource('purchase.new', { path: '/purchases/new' });

  this.resource('attachments');
  this.resource('search');

  this.resource('vendors');
  this.resource('vendor', { path: '/vendors/:vendor_id' }, function() {
    this.route('edit');
  });

  this.resource('users');
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
