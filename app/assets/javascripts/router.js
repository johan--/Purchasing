
App.Router.map(function() {
  this.resource('purchases');
  this.resource('purchase', { path: '/purchases/:purchase_id'}, function() {
    this.route('edit');
  });

  this.resource('tags', { path: '/tags' }, function() {
  });
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
