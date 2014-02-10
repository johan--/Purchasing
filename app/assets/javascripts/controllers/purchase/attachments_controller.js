
App.PurchaseAttachmentsController = Ember.ArrayController.extend({
  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  refreshViewsCounter: 1,


  actions: {

    refreshDroppableViews: function() {
      // We can't trust @each observer since content could be unrelated records
      var cur = this.get('refreshViewsCounter');
      this.set('refreshViewsCounter', cur + 1);
    }
  }

});
