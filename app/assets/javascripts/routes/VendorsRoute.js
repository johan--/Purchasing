App.VendorsRoute = Ember.Route.extend({
  observesParameters: ['page', 'search', 'letter'],

  model: function() {
    return this.get('store').find('vendor', this.get('queryParameters'));
  },

  renderTemplate: function() {
    this.render('vendors/index');
  }

});
