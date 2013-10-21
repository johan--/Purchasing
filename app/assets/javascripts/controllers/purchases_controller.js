App.PurchasesController = Ember.ArrayController.extend(App.PaginationSupport , {
  itemController: 'purchase',

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
        dir = (field=='date') ? 'DESC' : 'ASC';

      this.newPage({sort: field, direction: dir, page: 1});
      return false;
    },

    starMe: function(record) {
      parent = this;

      $.post('/purchases/star/' + record.id)
        .done(function(data) {
          record.reload();
      })
        .fail(function(data) {
          //TODO
          console.log("failed to update star " + id);
      });

      return false;
    },

  },

  newPage: function(params) {
    params = params || {};

    var store = this.get('store');
    var metadata = this.get('metadata');
    var page = params.page || metadata.page || 1;
    var buyer = params.buyer || metadata.buyer || 'all';
    var sort = params.sort || metadata.sort || 'date';
    var direction = params.direction || metadata.direction || 'desc';
    var tab = params.tab || metadata.tab || 'pending';

    var parsed_params = Ember.Router.QueryParameters.create({page: page,
                                                             buyer: buyer,
                                                             sort: sort,
                                                             direction: direction,
                                                             tab: tab });
    this.transitionToRoute('purchases', parsed_params);
  }
});
