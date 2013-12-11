
App.VendorRecordView = Ember.View.extend({
  templateName: 'vendors/vendor',
  classNames: ['vendor'],


  click: function() {
    this.get('controller').send('openRecord', this.$());
  },


  willDestroyElement: function() {
    Ember.removeDom(this.$());
  },

  actions: {

    deleteMe: function() {
      this.get('controller').send('deleteRecord');
    }
  }
});
