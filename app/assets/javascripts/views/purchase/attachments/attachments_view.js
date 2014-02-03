
App.AttachmentsView = Ember.View.extend({
  templateName: 'purchase/attachments/form',


  tabs: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],
  selectedTab: 'Other',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  assignedAttachments: function() {
    var content = this.get('controller.store').all('attachment'),
        currentTab = this.get('selectedTab');

    if (isEmpty(content))
      return;

    return content.filter(function(item){
      var purchase = item._data.purchase,
          category = item.get('category');

      if (isEmpty(purchase))
        return false;

      return (currentTab === 'Other') ? isEmpty(category) : category === currentTab;
    });
  }.property('controller.refreshViewsCounter', 'selectedTab'),


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

    setCategoryTab: function(tab) {
      this.set('selectedTab', tab);
    }
  }
});
