
App.UserRecordView = Ember.View.extend({
  templateName: 'users/user',
  classNames: ['user'],
  tagName: 'tr',

  click: function() {
    this.get('controller').send('openRecord', this.$());
  },


  willDestroyElement: function() {
    Ember.removeDom(this.$());
    this._super();
  }
});
