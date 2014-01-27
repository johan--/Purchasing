
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
    return Ember.merge({ purSearch: null,
                         searchPage: 1
                       }, vals);
  },


  cleanAdvancedParams: function(val) {
    return { purSearch: val,
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
             lines: null,
             searchPage: 1
           };
  }
});
