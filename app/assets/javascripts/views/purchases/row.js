
App.PurchasesRowView = Ember.View.extend({
  templateName: 'purchases/row',
  classNames: ['purchase'],
  classNameBindings: ['controller.isSelected', 'controller.dateExpectedPastDue:past-due'],
  tagName: 'tr',

  attributeBindings: ['title', 'data-toggle'],

  'data-toggle': 'tooltip',


  title: function() {
    return this.get('controller.title');
  }.property('controller.title'),


  click: function(e) {
    if(!$(e.toElement).is('.dropdown-toggle, .caret') && this.get('controller.canHaveActionControls') === true) {
      this.get('controller').send('selectRecord');
    }
  },


  actions: {

    starMe: function() {
      this.get('controller').send('starMe');
      return false;
    },


    openRecordEdit: function() {
      this.get('controller').send('openRecordEdit');
      return false;
    },


    openRecordShow: function() {
      this.get('controller').send('openRecordShow');
      return false;
    },


    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
      return false;
    }
  }
});
