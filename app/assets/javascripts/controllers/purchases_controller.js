App.PurchasesController = Ember.ArrayController.extend(App.PaginationSupport , {
  buyers: buyers,

  // TODO: There has got to be a way to assign tabs
  canTab: function(tab) {
    return this.get('metadata').tab == tab;
  },
  canTabPending: function() {
    return this.canTab('Pending');
  }.property('metadata'),
  canTabReceived: function() {
    return this.canTab('Received');
  }.property('metadata'),
  canTabReconciled: function() {
    return this.canTab('Reconciled');
  }.property('metadata'),

  actions: {
    buyerUpdate: function(buyer) {
      this.newPage({buyer: buyer, page: 1});
      return false;
    },

    tabClick: function(tab) {
      this.newPage({ tab: tab });
      return false;
    },

    sortClick: function(field) {
      cur_sort = this.get('metadata').sort;
      cur_dir = this.get('metadata').direction;
      if (cur_sort == field)
        dir = (cur_dir == 'ASC') ? 'DESC' : 'ASC';
      else
        dir = 'DESC';

      this.newPage({sort: field, direction: dir, page: 1});
      return false;
    }
  },

  newPage: function(params) {
    var store = this.get('store');
    var pagination = this.get('metadata');
    var page = params.page || pagination.page || 1;
    var buyer = params.buyer || pagination.buyer || '';
    var sort = params.sort || pagination.sort || '';
    var direction = params.direction || pagination.direction || '';
    var tab = params.tab || pagination.tab || '';

    var parsed_params = Ember.Router.QueryParameters.create({page: page,
                                                             buyer: buyer,
                                                             sort: sort,
                                                             direction: direction,
                                                             tab: tab });
    this.transitionToRoute('purchases', parsed_params);
  }
});
