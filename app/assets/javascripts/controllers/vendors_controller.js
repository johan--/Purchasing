App.VendorsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  needs:['application'],
  applicationBinding: "controllers.application",
  itemController: 'vendor',


  newPage: function(params) {
    params = params || {};

    var store = this.get('store');
    var metadata = this.get('metadata');
    var page = params.page || metadata.page || 1;
    var search = params.search || metadata.search || 1;
    var letter = params.letter || metadata.letter || 1;

    var parsed_params = Ember.Router.QueryParameters.create({page: page,
                                                             search: search,
                                                             letter: letter });
    this.transitionToRoute('vendors', parsed_params);
  }

})
