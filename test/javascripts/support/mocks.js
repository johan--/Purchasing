
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
  }
};

mockUrls = {
  mocks: [],

  clearMocks: function() {
    this.mocks = [];
  },

  addMock: function(url, block) {
    this.mocks.push({ url: url, block: block });
  },

  canMock: function(url) {
    var foundMock = null;

    $.each(this.mocks, function(mock) {
      if (mock.url === url)
        foundMock =  mock;
    });

    return foundMock;
  }
}



// Setup mock for ajax
$.ajax = function(params) {
  var self = this;

  console.log('Ajax called with: ');
  console.log(params);
  
  var mockBlock = mockUrls.canMock(params.url);

  mockResults.ajaxParams = params;

  return new Ember.RSVP.Promise(function(resolve) {
    Ember.run.later(function() {
      resolve();
      if (mockBlock)
         return eval(mockBlock);
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
