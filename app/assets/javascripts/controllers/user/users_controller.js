
App.UsersController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'user',
  needs: ['application'],
  applicationBinding: 'controllers.application',

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
    this.transitionToRoute({ queryParams: params });
  }
});
