
App.PurchaseShowController = Ember.ObjectController.extend(App.PurchaseControllerMixin, {

  isEditing: false,


  vendorsList: function() {
    var vendors = this.get('vendors');

    if (vendors) {
      return vendors.reduce(function(res, vendor){
        res.push(vendor.get('name'));
        return res;
      }, []).join(', ');
    }

  }.property('vendors')

});
