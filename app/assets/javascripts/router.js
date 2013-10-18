
App.Router.map(function() {
  this.resource('purchases', { path: '/' }, function() {
      this.route('new');
      this.resource('purchase', { path: '/purchases/:purchase_id'}, function() {
        this.route('edit');
      });
  });
});
