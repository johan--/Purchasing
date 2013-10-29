App.VendorsController = Ember.ArrayController.extend(App.ControllerNotifiableMixin,
                                                     App.MetaDataMixin, {
  itemController: 'vendor',

  getAllLetters: function() {
    return 'All A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.w();
  }.property(),

  currentLetter: function() {
    return this.get('metadata').letter;
  }.property('metadata'),

  newPage: function(params) {
    params = params || {};

    var store = this.get('store');
    var metadata = this.get('metadata');
    var page = params.page || metadata.page || 1;
    var search = params.search || null;
    var letter = params.letter || null;

    var parsed_params = Ember.Router.QueryParameters.create({page: page,
                                                             search: search,
                                                             letter: letter });
    this.transitionToRoute('vendors', parsed_params);
  },

  actions: {
    letterClick: function(letter) {
      letter = letter || 'All';
      if (letter != this.currentLetter)
        this.newPage({ letter: letter, page: 1 })
    },

    startSearch: function(search) {
      this.newPage({ search: search, page: 1 });
    },

    newRecord: function() {
      record = this.store.createRecord('vendor');
      this.send('openModal', 'VendorEdit', 'vendors/edit', record);
      return false;
    }
  }
})
