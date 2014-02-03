
App.AttachmentsView = Ember.View.extend({
  templateName: 'purchase/attachments/form',


  categories: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],
  selectedCategory: 'Other',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  assignedAttachments: function() {
    var content = this.get('controller.store').all('attachment'),
        currentCategory = this.get('selectedCategory');

    if (isEmpty(content))
      return;

    return content.filter(function(item){
      var purchase = item._data.purchase,
          category = item.get('category');

      if (isEmpty(purchase))
        return false;

      return (currentCategory === 'Other') ? isEmpty(category) : category === currentCategory;
    });
  }.property('controller.refreshViewsCounter', 'selectedCategory'),


  unassignedAttachments: function() {
    var content = this.get('controller.store').all('attachment');

    if (isEmpty(content))
      return;

    return content.filter(function(item){
       var purchase = item._data.purchase;

      if (isEmpty(purchase))
        return true;
    });
  }.property('controller.refreshViewsCounter'),


  actions: {

    setCategory: function(tab) {
      this.set('selectedCategory', tab);
    }
  }
});
