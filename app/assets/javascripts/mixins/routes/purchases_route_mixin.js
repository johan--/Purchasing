
App.PurchasesRouteMixin = Ember.Mixin.create({


  actions: {

    reloadPage: function() {
      this.refresh();
    }
  }
});
