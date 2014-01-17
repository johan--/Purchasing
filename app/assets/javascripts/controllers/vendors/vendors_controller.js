App.VendorsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'vendor',
  needs: 'application',

  queryParams: ['vendPage', 'vendSearch', 'letter' ],


  getAllLetters: function() {
    return 'All A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.w();
  }.property(),


  currentLetter: function() {
    return this.get('metadata').letter;
  }.property('metadata'),


  noRecordsFound: function() {
    return this.get('length') === 0;
  }.property('length'),


  actions: {

    newRecord: function() {
      record = this.store.createRecord('vendor');
      this.send('openModal', 'VendorEdit', 'vendors/edit', record);
      return false;
    },


    letterClick: function(letter) {
      letter = letter || 'All';
      if (letter != this.currentLetter)
        this.newPage({ letter: letter, vendPage: 1 });
    },


    startSearch: function(vendSearch) {
      this.newPage({ vendSearch: vendSearch, vendPage: 1, letter: 'All' });
    },


    page: function(page) {
      this.newPage({ vendPage: page });
    }
  },


  newPage: function(params) {
    var queryParams = this.get('queryParams'),
        metadata = this.get('metadata');

    params = params || {};
    var vendPage = params.vendPage || metadata.vendPage || 1,
        vendSearch = params.vendSearch || null,
        letter = params.letter || metadata.letter || null;

    this.transitionToRoute({ queryParams: { vendPage: vendPage, vendSearch: vendSearch, letter: letter } });
  }
});
