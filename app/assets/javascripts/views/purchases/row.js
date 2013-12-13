
App.PurchasesRowView = Ember.View.extend({
  templateName: 'purchases/row',
  classNames: ['purchase'],
  classNameBindings: ['controller.parentController.isSelecting', 'controller.isSelected'],
  tagName: 'tr',


  actions: {

    starMe: function() {
      this.get('controller').send('starMe');
      return false;
    },


    openRecord: function() {
      this.get('controller').send('openRecord');
    },


    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
      return false;
    }
  }
});
