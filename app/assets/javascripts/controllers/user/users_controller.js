App.UsersController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'user',
  needs: ['application'],

  queryParams: ['userPage', 'userSearch'],

  noRecordsFound: function() {
    return this.get('length') === 0;
  }.property('length'),


  actions: {

    startQuickSearch: function(userSearch) {
      this.newPage({ userSearch: userSearch, userPage: 1 });
    },


    page: function(page) {
      this.newPage({ userPage: page });
    }
  },


  newPage: function(params) {
    var queryParams = this.get('queryParams'),
        metadata = this.get('metadata');

    params = params || {};
    var userPage = params.userPage || metadata.userPage || 1,
        userSearch = params.userSearch || null;

    this.transitionToRoute({ queryParams: { userPage: userPage, userSearch: userSearch } });
  }
});
