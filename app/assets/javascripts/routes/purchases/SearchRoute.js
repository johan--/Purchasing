App.SearchRoute = Ember.Route.extend(App.PurchasesRouteMixin, {


  model: function(params, transition, queryParams) {
    console.log(params)
    return this.get('store').findSearch(params, this);
  },


  renderTemplate: function() {
    this.render('search/index', {
      controller: 'search'
    });
  },


  metaName: function() {
    return 'search';
  }.property(),


  actions: {

    page: function(page) {
      this.newPage({ searchPage: page });
      return false;
    }
  },


  getParams: function(param) {
    var metadata = this.get('currentModel.meta'),
        params = param || {},
        queryParams = {};

    queryParams.quickSearch     = metadata.quickSearch   || null;
    queryParams.vendor          = metadata.vendor        || null;
    queryParams.requester       = metadata.requester     || null;
    queryParams.buyer           = metadata.buyer         || null;
    queryParams.dateRequested   = metadata.dateRequested || null;
    queryParams.datePurchased   = metadata.datePurchased || null;
    queryParams.dateExpected    = metadata.dateExpected  || null;
    queryParams.lines           = metadata.lines         || null;

    queryParams.searchPage      = params.searchPage      || metadata.searchPage     || 1;
    queryParams.sort            = params.sort            || metadata.sort           || 'date';
    queryParams.direction       = params.direction       || metadata.direction      || 'DESC';

    queryParams.tab = queryParams.filterBuyer = queryParams.filterVendor =
    queryParams.filterMinDate = queryParams.filterMaxDate = queryParams.filterReceiving =
    queryParams.filterPending = null;

    return { queryParams: queryParams };
  }
});
