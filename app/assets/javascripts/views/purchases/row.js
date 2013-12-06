
App.PurchasesRowView = Ember.View.extend({
  templateName: 'purchases/row',


  actions: {

    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
    }
  }
});
