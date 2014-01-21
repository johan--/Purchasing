
mockResults = {
  ajaxParams: null,
  alertMessage: null,
  url: null,
  params: null,

  clearMockResults: function() {
    this.ajaxParams = null;
    this.alertMessage = null;
    this.url = null;
    this.params = null;
  },

  addMockToRoute: function(routeName){
    var self = this,
        testRoute = helperMethods.route(routeName);

    testRoute.reopen({
      transitionTo: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
       },

      replaceWith: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
      }
    });
  },

  addMockToController: function(routeName){
    var self = this,
        testController = helperMethods.controller(routeName);

    testController.reopen({
      transitionToRoute: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
      },
    });
  }
};


mockUrls = {
  mocks: [],

  clearMocks: function() {
    this.mocks = [];
  },

  addMock: function(url, block) {
     console.log('added mock for ' + url);
     this.mocks.push({ url: url, block: block });
  },

  canMock: function(url) {
    var foundMock = null;

    $.each(this.mocks, function(i, mock) {
      if (mock.url === url)
        foundMock = mock.block;
    });

    return foundMock;
  }
};



// Setup mock for ajax
$.ajax = function(params) {
  var self = this;
  console.log('AJAX running');
  console.log(params);

  var mockBlock = mockUrls.canMock(params.url);
  mockResults.ajaxParams = params;

  return new Ember.RSVP.Promise(function(resolve){
    Ember.run.later(function(){
      var result = null;

      if (mockBlock && Ember.typeOf(mockBlock) === 'function')
        result = mockBlock(params.data);

      resolve(result);
    }, 20);
  });
};

window.pause = window.alert;

// Setup mock for alert()
window.alert = function(msg) {
  mockResults.alertMessage = msg;
}


// Setup mock for confirm()
window.confirm = function(msg) {
  mockResults.alertMessage = msg;
  return true;
}
