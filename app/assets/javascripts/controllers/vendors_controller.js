App.VendorsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  needs:['application'],
  applicationBinding: "controllers.application",
  itemController: 'vendor',

  getAllLetters: function() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
  }.property(),

  curLetterIs: function(letter) {
    return this.get('metadata').letter == letter;
  }.property('metadata.letter'),

  noLetterParam: function() {
    return this.get('metadata').letter == null;
  }.property(),

  newPage: function(params) {
    params = params || {};

    var store = this.get('store');
    var metadata = this.get('metadata');
    var page = params.page || metadata.page || 1;
    var search = params.search || metadata.search || null;
    var letter = params.letter || metadata.letter || null;

    var parsed_params = Ember.Router.QueryParameters.create({page: page,
                                                             search: search,
                                                             letter: letter });
    this.transitionToRoute('vendors', parsed_params);
  },

  actions: {
    letterClick: function(letter) {
      letter = letter || 'All';
      this.newPage({ letter: letter, page: 1 })
    }
  }

})
