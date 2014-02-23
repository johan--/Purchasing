
App.AttachmentsController = Ember.ArrayController.extend(App.AttachmentsControllerMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  purType: 'materials',

  isMaterials: Ember.computed.equal('purType', 'materials'),
  isServices: Ember.computed.equal('purType', 'services'),


  filteredContent: function() {
    return this.filter(function(item){
      return !item.get('hasPurchaseID') && item.get('isNotDeleted');
    });
  }.property('@each.hasPurchaseID'),


  actions: {

    setType: function(purType) {
      this.set('purType', purType);
    },


    newPurchase: function() {
      var purType = this.get('purType'),
          attachments = this.filterBy('isSelected');

      if (attachments.filterBy('isDirty').length > 0)
        return;

      attachments = attachments.map(function(item) { return item.get('content.id'); });
      this.transitionToRoute('purchase.new', { queryParams: { newPurchaseType: purType, newAttachments: attachments } });
    }
  }

});
