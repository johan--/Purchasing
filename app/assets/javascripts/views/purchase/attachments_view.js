
App.AttachmentsView = Ember.View.extend({
  tagName: 'div',
  templateName: 'purchase/attachments_view',
  classNames: ['attachmentsContainer'],
  classNameBindings: ['isDragging'],

  isDragging: false,

  tabs: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],
  selectedTab: 'Other',


  filteredContent: function() {
    var content = this.get('controller.content'),
        currentTab = this.get('selectedTab');

    if (!content)
      return;

    return content.filter(function(item){
      var category = item.get('category');

      if (currentTab === 'Other')
        return Ember.isEmpty(category);
      else
        return category === currentTab;
    });
  }.property('content.isLoaded', 'selectedTab'),


  dragEnter: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', true);
  },


  dragLeave: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', false);
  },


  dragOver: function(e) {
    this.cancelEvents(e);
    this.set('isDragging', true);
  },


  drop: function(e) {
    this.cancelEvents(e);

    this.set('isDragging', false);
    this.get('controller').send('addFiles', e.dataTransfer.files);
  },


  cancelEvents: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },


  actions: {

    setCategoryTab: function(tab) {
      this.set('selectedTab', tab);
    }
  }
});
