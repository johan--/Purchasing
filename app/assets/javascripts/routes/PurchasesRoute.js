App.PurchasesRoute = Ember.Route.extend({

  model: function(params, queryParams, transition) {
    return this.get('store').find('purchase', queryParams);
  },

  renderTemplate: function() {
    this.render('purchases/index');
  },

  setupController: function(controller, model, queryParams) {
    controller.set('model', model);
    controller.set('queryParams', queryParams);
  },

  actions: {
    buyerUpdate: function(buyer) {
      this.newPage({ buyer: buyer, purPage: 1 });
      return false;
    },

    tabClick: function(tab) {
      this.newPage({ tab: tab, purPage: 1 });
      return false;
    },

    sortClick: function(field) {
      cur_sort = this.get('controller.metadata').sort;
      cur_dir = this.get('controller.metadata').direction;
      if (cur_sort == field)
        dir = (cur_dir == 'ASC') ? 'DESC' : 'ASC';
      else
        dir = (field=='date') ? 'DESC' : 'ASC';

      this.newPage({ sort: field, direction: dir, purPage: 1 });
      return false;
    },

    page: function(page) {
      this.newPage({ purPage: page });
    },

    willTransition: function(transition) {
      $('.ui-tooltip').remove(); // Cleanup any hung tooltips
    }
  },

  newPage: function(params) {
    var queryParams = this.get('controller.queryParams'),
        metadata = this.get('controller.metadata');

    params = params || {};

    var purPage = params.purPage || metadata.purPage || 1,
        buyer = params.buyer || metadata.buyer || 'all',
        sort = params.sort || metadata.sort || 'date',
        direction = params.direction || metadata.direction || 'DESC',
        tab = params.tab || metadata.tab || 'pending';

    this.transitionTo({ queryParams: { purPage: purPage, buyer: buyer, sort: sort, direction: direction, tab: tab } });
  }
});
