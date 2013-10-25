
App.Router.map(function() {
  this.resource('purchases');
  this.resource('purchase', { path: '/purchases/:purchase_id'}, function() {
    this.route('edit');
  });

  this.resource('tags');
  this.resource('vendors');
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
