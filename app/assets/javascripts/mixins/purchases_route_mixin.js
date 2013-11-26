
App.PurchasesRouteMixin = Ember.Mixin.create({

  actions: {
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
    var params = this.getParams(params);

    this.get('controller').set('reconciling', false);
    this.transitionTo(params);
  },

  getParams: function(params) {
    var metadata = this.get('currentModel.meta'),
        params = params || {},
        queryParams = {};

    queryParams.purPage         = params.purPage       || metadata.purPage        || 1;
    queryParams.sort            = params.sort          || metadata.sort           || 'date';
    queryParams.direction       = params.direction     || metadata.direction      || 'DESC';
    queryParams.tab             = params.tab           || metadata.tab            || 'pending';
    queryParams.filterBuyer     = params.filterBuyer   || metadata.filterBuyer    || 'all';
    queryParams.filterVendor    = params.filterVendor  || metadata.filterVendor   || null;
    queryParams.filterMinDate   = params.filterMinDate || metadata.filterMinDate  || null;
    queryParams.filterMaxDate   = params.filterMaxDate || metadata.filterMaxDate  || null;
    queryParams.filterReceiving = this.convert_bool(params.filterReceiving) || this.convert_bool(metadata.filterReceiving) || true;
    queryParams.filterPending   = this.convert_bool(params.filterPending)   || this.convert_bool(metadata.filterPending)   || true;
    queryParams.mode            = params.mode          || 0;

    return { queryParams: queryParams }
  },

  convert_bool: function(bool) {
    if (Ember.isEmpty(bool))
      return null;
    return (bool == true) ? 2 : 1;
  }

});
