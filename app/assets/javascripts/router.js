
App.Router.map(function() {
  this.resource('purchases');
  this.resource('purchase', { path: '/purchases/:purchase_id'}, function() {
    this.route('edit');
  });

  this.resource('vendors');

  // TODO:   (included so menu works)
  this.resource('tags');
  this.resource('users');
  this.resource('settings');
  this.resource('reports');
  this.resource('logout');
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
