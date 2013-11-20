App.VendorRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').find('vendor', params.vendor_id);
  }

});
