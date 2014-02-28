
App.SearchControllerMixin = Ember.Mixin.create({

  actions: {

    startQuickSearch: function(val) {
      if (!isEmpty(val)) {
        var params = this.cleanAdvancedParams(val);
        this.transitionToRoute('search', { queryParams: params });
      }
    },


    startAdvancedSearch: function(vals) {
      if (!isEmpty(vals)) {
        var params = this.cleanQuickParams(vals);
        this.transitionToRoute('search', { queryParams: params });
      }
    }
  },


  cleanQuickParams: function(vals) {
    if (vals && !isEmpty(vals.searchId))
      return Ember.merge(this.cleanAdvancedParams(null), { searchId: vals.searchId });

    return Ember.merge(vals, { purSearch: null,
                               searchPage: 1 });
  },


  cleanAdvancedParams: function(val) {
    return { purSearch: val,
             searchId: null,
             vendor: null,
             requester: null,
             department: null,
             buyer: null,
             dateRequestedMin: null,
             dateRequestedMax: null,
             datePurchasedMin: null,
             datePurchasedMax: null,
             dateExpectedMin: null,
             dateExpectedMax: null,
             includeReceived: null,
             purType: null,
             lines: null,
             notes: null,
             searchPage: 1
           };
  }
});
