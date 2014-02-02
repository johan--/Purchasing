
App.AttachmentsView = Ember.View.extend({
  templateName: 'purchase/attachments/form',


  tabs: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],
  selectedTab: 'Other',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  assignedAttachments: function() {
    var content = this.get('controller.content'),
        currentTab = this.get('selectedTab');

    if (!content)
      return;

    return content.filter(function(item){
      var purchase = item._data.purchase,
          category = item.get('category');

      if (!purchase)
        return false;

      return (currentTab === 'Other') ? isEmpty(category) : category === currentTab;
    });
  }.property('content.isLoaded', 'selectedTab'),


  unassignedAttachments: function() {
    var content = this.get('controller.content');

    if (!content)
      return;

    return content.filter(function(item){
      var purchase = item._data.purchase;

      if (!purchase)
        return true;
    });
  }.property('content.isLoaded', 'selectedTab'),


  actions: {

    setCategoryTab: function(tab) {
      this.set('selectedTab', tab);
    }
  }
});
