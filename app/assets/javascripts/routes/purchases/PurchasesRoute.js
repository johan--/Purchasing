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
        dir = (field == 'date') ? 'DESC' : 'ASC';

      this.newPage({ sort: field, direction: dir, purPage: 1 });
      return false;
    },

    newPage: function(pages) {
      this.newPage(pages);
      return false;
    },

    reloadPage: function() {
      // Ember / queryParams will stop a transition if the URL is exactly the same
      // There isn't a good way to refresh all of the model data, so this toggles a 'mode' param to force the refresh
      var queryParams = this.get('queryParams'),
          current_mode = queryParams.mode;

      // TODO: There has got to be a better way than this...
      current_mode = (Ember.isEmpty(current_mode) || current_mode == 0) ? 1 : 0;

      this.replaceWith('purchases', this.getParams({ mode: current_mode })); // ReplaceWith won't update History
    },

    page: function(page) {
      this.newPage({ purPage: page });
      return false;
    },

    willTransition: function(transition) {
      $('.ui-tooltip').remove(); // Cleanup any hung tooltips
    }
  },

  newPage: function(params) {
    this.transitionTo(this.getParams(params));
  },

  getParams: function(params) {
    var metadata = this.get('currentModel.meta'),
        params = params || {};

    var purPage = params.purPage || metadata.purPage || 1,
        buyer = params.buyer || metadata.buyer || 'all',
        sort = params.sort || metadata.sort || 'date',
        direction = params.direction || metadata.direction || 'DESC',
        tab = params.tab || metadata.tab || 'pending',
        vendor = params.vendor || metadata.vendor || null,
        filterMinDate = params.filterMinDate || metadata.filterMinDate || null,
        filterMaxDate = params.filterMaxDate || metadata.filterMaxDate || null,
        filterReceiving = this.convert_bool(params.filterReceiving) || this.convert_bool(metadata.filterReceiving) || true,
        filterPending = this.convert_bool(params.filterPending) || this.convert_bool(metadata.filterPending) || true;
        mode = params.mode || 0;

    return { queryParams:  { purPage: purPage,
                             buyer: buyer,
                             sort: sort,
                             direction: direction,
                             tab: tab,
                             vendor: vendor,
                             filterMinDate: filterMinDate,
                             filterMaxDate: filterMaxDate,
                             filterReceiving: filterReceiving,
                             filterPending: filterPending,
                             mode: mode
                           }
            }
  },

  convert_bool: function(bool) {
    if (Ember.isEmpty(bool))
      return null;
    return (bool == true) ? 2 : 1;
  }

});
