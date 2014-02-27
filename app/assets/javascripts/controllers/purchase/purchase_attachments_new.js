
App.PurchaseAttachmentsNewController = Ember.ArrayController.extend({

  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

});
