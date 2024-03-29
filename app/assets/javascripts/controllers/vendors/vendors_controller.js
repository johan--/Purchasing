
App.VendorsController = Ember.ArrayController.extend(App.MetaDataMixin, {

  itemController: 'vendor',
  needs: ['application'],

  queryParams: ['vendPage', 'vendSearch', 'letter' ],
  letter: 'All',
  currentLetter: Ember.computed.alias('letter'),

  getAllLetters: function() {
    return 'All A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.w();
  }.property(),


  actions: {

    newRecord: function() {
      var record = this.store.createRecord('vendor');
      this.send('openModal', 'VendorNew', 'vendors/form', record);
      return false;
    },


    letterClick: function(letter) {
      letter = letter || 'All';
      if (letter !== this.currentLetter)
        this.newPage({ letter: letter, vendPage: 1, vendSearch: null });
    },


    startQuickSearch: function(vendSearch) {
      this.newPage({ vendSearch: vendSearch, vendPage: 1, letter: 'All' });
    },


    page: function(page) {
      this.newPage({ vendPage: page });
    }
  },


  newPage: function(params) {
    this.transitionToRoute({ queryParams: params });
  }
});
