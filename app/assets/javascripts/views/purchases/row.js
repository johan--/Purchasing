
App.PurchasesRowView = Ember.View.extend({
  templateName: 'purchases/row',
  classNames: ['purchase'],
  classNameBindings: ['controller.isSelected'],
  tagName: 'tr',


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
      this.get('controller').send('openRecord');
      return false;
    },


    openRecordShow: function() {
      this.get('controller').send('openRecord');
      return false;
    },


    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
      return false;
    }
  }
});
