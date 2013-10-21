
App.Router.map(function() {
  this.resource('purchases', { path: '/purchases' });
  this.resource('purchase', { path: '/purchases/:purchase_id/edit'});

  this.resource('tags', { path: '/tags' }, function() {
  });
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
