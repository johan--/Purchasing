
App.PurchasesRouteMixin = Ember.Mixin.create({


  actions: {

    reloadPage: function() {
      this.refresh();
    },


    willTransition: function(transition) {
      $('.tooltip').remove(); // Cleanup any hung tooltips
    }
  }
});
