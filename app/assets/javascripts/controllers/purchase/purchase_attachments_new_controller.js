
App.PurchaseAttachmentsNewController = Ember.ArrayController.extend(App.AttachmentsControllerMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

});
