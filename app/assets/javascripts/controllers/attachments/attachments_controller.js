
App.AttachmentsController = Ember.ArrayController.extend({
  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  purType: 'materials',

  isMaterials: function() {
    return this.get('purType') === 'materials';
  }.property('purType'),


  isServices: function() {
    return this.get('purType') === 'services';
  }.property('purType'),


  itemsAreSelected: function () {
    return this.filterBy('isSelected', true).length > 0;
  }.property('@each.isSelected'),


  actions: {

    setType: function(purType) {
      this.set('purType', purType);
    },


    newPurchase: function() {
      var attachments = this.filterBy('isSelected', true).map(function(item) {
        return item.get('content.id');
      });

      var purType = this.get('purType');

      this.transitionToRoute('purchase.new', { queryParams: { newPurchaseType: purType, newAttachments: attachments } });
    }
  }
});
