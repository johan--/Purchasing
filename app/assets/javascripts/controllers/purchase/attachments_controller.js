
App.PurchaseAttachmentsController = Ember.ArrayController.extend(App.AttachmentsControllerMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  selectedCategory: 'Other',
  categories: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],

  content: function() {
    return this.store.all('attachment');
  },


  assignedAttachments: function() {
    var selectedCategory = this.get('selectedCategory');

    return this.filter(function(item){
      var purchase = item.get('purchase_id_server'),
          category = item.get('category');

      if (isEmpty(purchase))
        return false;

      if (selectedCategory === 'Other')
        return isEmpty(category) || category === 'Other';

      return category === selectedCategory;
    });
  }.property('@each.purchase_id_server', 'selectedCategory', '@each.category'),


  unassignedAttachments: function() {
    return this.filterBy('purchase_id_server', null);
  }.property('@each.purchase_id_server'),


  actions: {

    assign: function() {
      var selectedCategory = this.get('selectedCategory'),
          purchase = this.get('parentController.model');

      this.filterBy('isSelected', true).forEach(function(attachment) {
        attachment.updateCategoryAndPurchase(selectedCategory, purchase);
      });
    },


    unassign: function() {
      this.filterBy('isSelected', true).forEach(function(attachment) {
        attachment.updateCategoryAndPurchase(null, null);
      });
    },


    selectNone: function() {
      this.filterBy('isSelected', true).setEach('isSelected', false);
    }
  },


  beforeUpload: function() {
    var category = this.get('selectedCategory'),
        purchase = this.get('parentController.model.id');

    var tempRec = this.store.createRecord('attachment', { category: category, purchase_id_server: purchase });

    this.addObject(tempRec);
    return tempRec;
  }
});
