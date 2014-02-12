
App.AttachmentsController = Ember.ArrayController.extend(App.AttachmentsControllerMixin, {
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


  filteredContent: function() {
    return this.filter(function(item){
      if (isEmpty(item.get('purchase_id_server')))
        return true;
    });
  }.property('@each.purchase_id_server'),


  actions: {

    setType: function(purType) {
      this.set('purType', purType);
    },


    newPurchase: function() {
      var purType = this.get('purType'),
          attachments = this.filterBy('isSelected', true);

      if (attachments.filterBy('isDirty', true).length > 0)
        return;

      attachments = attachments.map(function(item) { return item.get('content.id'); });
      this.transitionToRoute('purchase.new', { queryParams: { newPurchaseType: purType, newAttachments: attachments } });
    }
  }

});
