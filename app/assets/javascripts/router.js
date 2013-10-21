
App.Router.map(function() {
  this.resource('purchases', { path: '/purchases' }, function() {
      this.route('new');
      this.resource('purchase', { path: '/purchases/:purchase_id/edit'}, function() {
        this.route('edit');
      });
  });
  this.resource('tags', { path: '/tags' }, function() {
  });
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({});
