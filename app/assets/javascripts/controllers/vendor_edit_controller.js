App.VendorEditController = Ember.ObjectController.extend({

  actions: {
    close: function(){
      return this.send('closeModal');
    }
  }
})
