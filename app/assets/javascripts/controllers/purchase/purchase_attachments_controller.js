
App.PurchaseAttachmentsController = Ember.ArrayController.extend(App.AttachmentsControllerMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  selectedCategory: 'Other',
  categories: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],

  init: function() {
    // Observe all attachments
    // (this will observe any changes to the current set of attachments in the store)
    this.set('model', this.store.all('attachment'));
    this._super();
  },


  assignedAttachments: function() {
    var selectedCategory = this.get('selectedCategory'),
        model_id = this.get('parentController.model.id');

    return this.filter(function(item){
      var server_id = item.get('purchase_id_server'),
          category = item.get('category');

      if (isEmpty(server_id) || server_id != model_id) // Use coercion
        return false;

      if (selectedCategory === 'Other')
        return isEmpty(category) || category === 'Other';

      return category === selectedCategory;
    });
  }.property('@each.purchase_id_server', 'selectedCategory', '@each.category'),


  unassignedAttachments: function() {
    return this.rejectBy('purchase_id_server');
  }.property('@each.purchase_id_server'),


  actions: {

    assign: function() {
      if (!App.Session.currentUser.get('is_buyer'))
        return;

      var selectedCategory = this.get('selectedCategory'),
          purchase = this.get('parentController.model');

      this.filterBy('isSelected').forEach(function(attachment) {
        attachment.updateCategoryAndPurchase(selectedCategory, purchase);
      });
    },


    unassign: function() {
      if (!App.Session.currentUser.get('is_buyer'))
        return;

      this.filterBy('isSelected').forEach(function(attachment) {
        attachment.updateCategoryAndPurchase(null, null);
      });
    }
  },


  beforeUpload: function(category, purchase_id) {
    var tempRec = this.store.createRecord('attachment', { category: category, purchase_id_server: purchase_id });

    this.addObject(tempRec);
    return tempRec;
  },


  afterUpload: function(tempRec, payload) {
    // We need a bit more than the mixin provides since there are two levels of filtering
    Ember.assert('afterUpload was not sent a tempRec', !!tempRec);
    Ember.assert('afterUpload was not sent a payload', !!payload);

    tempRec.deleteRecord();

    if (isEmpty(payload) || isEmpty(payload.attachment)) {
      console.log(payload);
      this.application.notify({ message: 'There was an error updating the attachment.  Please refresh this page', type: 'error' });
      return;
    }

    // Use push because this will return the record
    var newRec = this.store.push('attachment', payload.attachment);
    this.addObject(newRec);

    this.application.notify({ message: 'Attachment added', type: 'notice' });
  }
});
