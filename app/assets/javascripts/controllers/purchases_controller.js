App.PurchasesController = Ember.ArrayController.extend(App.ControllerNotifiableMixin,
                                                       App.MetaDataMixin, {
  itemController: 'purchase',

  buyers: function() {
    return eval(this.get('metadata').buyers); // EVIL
  }.property('metadata.buyers'),

  buyer: function() {
    return this.get('metadata').buyer;
  }.property('metadata.buyer'),

  canTabPending:    function() { return this.canTab('Pending');     }.property('metadata'),
  canTabReceived:   function() { return this.canTab('Received');    }.property('metadata'),
  canTabReconciled: function() { return this.canTab('Reconciled');  }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata').tab == tab;
  },

  sortDate:         function(){ return this.findSort('date');       }.property('metadata'),
  sortVendor:       function(){ return this.findSort('vendor');     }.property('metadata'),
  sortRequester:    function(){ return this.findSort('requester');  }.property('metadata'),
  sortDepartment:   function(){ return this.findSort('department'); }.property('metadata'),
  sortBuyer:        function(){ return this.findSort('buyer');      }.property('metadata'),
  findSort: function(field) {
    return this.get('metadata').sort == field;
  },

  sortDescending: function(){
    if (this.get('metadata').direction == 'DESC')
      return 'fa fa-sort-down fa-stack-1x';
    else
      return 'fa fa-sort-up fa-stack-1x';
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

    newRecord: function() {
      this.transitionToRoute('purchase.new');
      return false;
    }
  },

  newPage: function(params) {
    params = params || {};

    var store = this.get('store');
    var metadata = this.get('metadata');
    var page = params.page || metadata.page || 1;
    var buyer = params.buyer || metadata.buyer || 'all';
    var sort = params.sort || metadata.sort || 'date';
    var direction = params.direction || metadata.direction || 'DESC';
    var tab = params.tab || metadata.tab || 'pending';

    var parsed_params = Ember.Router.QueryParameters.create({page: page,
                                                             buyer: buyer,
                                                             sort: sort,
                                                             direction: direction,
                                                             tab: tab });
    this.transitionToRoute('purchases', parsed_params);
  }
});
