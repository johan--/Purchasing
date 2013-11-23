App.UsersController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'user',
  needs: 'application',

  noRecordsFound: function() {
    return this.get('length') == 0;
  }.property('length')
})
