
App.PurchasesRouteMixin = Ember.Mixin.create({


  actions: {

    sortClick: function(field) {
      cur_sort = this.get('controller.metadata.sort');
      cur_dir = this.get('controller.metadata.direction');
      if (cur_sort === field)
        dir = (cur_dir === 'ASC') ? 'DESC' : 'ASC';
      else
        dir = (field === 'dateRequested') ? 'DESC' : 'ASC';

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
      var queryParams = this.get('queryParams');
      var current_mode = (queryParams) ? queryParams.mode : null;

      // TODO: There has got to be a better way than this...
      current_mode = (Ember.isEmpty(current_mode) || current_mode === 0) ? 1 : 0;
      this.replaceWith('purchases.tabs', this.getParams({ mode: current_mode })); // ReplaceWith won't update History
    },


    page: function(page) {
      this.newPage({ purPage: page });
      return false;
    },


    willTransition: function(transition) {
      $('.ui-tooltip').remove(); // Cleanup any hung tooltips
    }
  },


  newPage: function(param) {
    var params = this.getParams(param);
    this.transitionTo('purchases.tabs', params);
  },


  getParams: function(param) {
    var metadata = this.get('currentModel.meta') || {},
        params = param || {},
        queryParams = {};

    queryParams.purPage         = params.purPage       || metadata.purPage        || 1;
    queryParams.sort            = params.sort          || metadata.sort           || 'dateRequested';
    queryParams.direction       = params.direction     || metadata.direction      || 'DESC';
    queryParams.tab             = params.tab           || metadata.tab            || 'Pending';
    queryParams.mode            = params.mode          || 0;

    return { queryParams: queryParams };
  },


  convert_bool: function(bool) {
    if (Ember.isEmpty(bool))
      return null;
    return (bool === true) ? 2 : 1;
  }
});
