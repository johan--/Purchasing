
myMocks = {
  ajaxParams: null,
  alertMessage: null,
  url: null,
  params: {},
  mocks: [],


  clearMocks: function() {
    this.ajaxParams = null;
    this.alertMessage = null;
    this.url = null;
    this.params = {};
    this.mocks = [];
  },


  addMockToRoute: function(routeName, withQueryParams){
    var self = this,
        testRoute = lookupRoute(routeName);

    testRoute.reopen({
      transitionTo: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
       },

      replaceWith: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
      },
    });

    if (withQueryParams) {
      testRoute.reopen({
        actions: {
          queryParamsDidChange: function(changed, all, del) {
            Ember.merge(self, { url: this.routeName, params: {queryParams: changed }});
            this._super(changed, all, del);
          }
        }
      });
    }
  },


  addMockToController: function(controllerName){
    var self = this,
        testController = lookupController(controllerName);

    testController.reopen({
      transitionToRoute: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
      },
    });
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
  },


  setupMockReceiveAll: function() {
    var a_test_response =
      { 'receiving': { 'id': 11, 'purchase_id': 1, 'receiving_line_ids': [5, 6] },
        'receiving_lines':[{ 'id': 5, 'quantity': 4, 'line_item_id': 1, 'receiving_id': 11 },
                           { 'id': 6, 'quantity': 5, 'line_item_id': 2, 'receiving_id': 11 }] };

    this.addMock(App.Globals.namespace + '/purchases/1/receive_all', function(data){
      return a_test_response;
    });
  },


  setupMockSearch: function() {
    var a_test_response = { purchases: Ember.copy(App.Purchase.FIXTURES_BASE, true) };

    this.addMock(App.Globals.namespace + '/search', function(data){
      return a_test_response;
    });
  }
};



// Setup mock for ajax
$.ajax = function(params) {
  var self = this,
      mockBlock = null;
  console.log('AJAX running');
  console.log(params);

  if (params && params.url)
    mockBlock = myMocks.canMock(params.url);
  else
    mockBlock = myMocks.canMock(params);

  myMocks.ajaxParams = params;

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
  myMocks.alertMessage = msg;
};


// Setup mock for confirm()
window.confirm = function(msg) {
  myMocks.alertMessage = msg;
  return true;
};
