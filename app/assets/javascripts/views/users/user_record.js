App.UserRecordView = Ember.View.extend({
  templateName: 'users/user',
  classNames: ['user'],


  click: function() {
    this.get('controller').send('openRecord', this.$());
  },


  willDestroyElement: function() {
    Ember.removeDom(this.$());
  }
});
