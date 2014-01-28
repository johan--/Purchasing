
App.AttachmentsView = Ember.View.extend({
  templateName: 'purchase/attachments/form',
  classNames: ['attachmentsContainer'],
  classNameBindings: ['isDragging'],

  isDragging: false,

  tabs: ['Other', 'Requisition', 'Confirmation', 'Packing List', 'Invoice', 'Return'],
  selectedTab: 'Other',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  filteredContent: function() {
    var content = this.get('controller.content'),
        currentTab = this.get('selectedTab');

    if (!content)
      return;

    return content.filter(function(item){
      var category = item.get('category');

      if (currentTab === 'Other')
        return isEmpty(category);
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
