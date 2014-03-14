
myMocks = {
  ajaxParams: null,
  alertMessage: null,
  url: null,
  params: {},
  mocks: [],
  numCalls: 0,

  clearMocks: function() {
    this.ajaxParams = null;
    this.alertMessage = null;
    this.url = null;
    this.params = {};
    this.mocks = [];
    this.numCalls = 0;
  },


  addMockToRoute: function(routeName, withQueryParams){
    var self = this,
        testRoute = lookups.route(routeName);

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
        testController = lookups.controller(controllerName);

    testController.reopen({
      transitionToRoute: function(url, params) {
        Ember.merge(self, { url: url, params: params });
        this._super(url, params);
      },
    });
  },


  addMock: function(url, block, type) {
     console.log('added mock for ' + url);
     this.mocks.push({ url: url, block: block, type: type });
  },


  canMock: function(url) {
    var result = null;

    $.each(this.mocks, function(i, mock) {
      if (mock.url === url)
        result = { block: mock.block, type: mock.type || 'success' };
    });

    return result;
  },


  setupMockReceiveAll: function() {

    var model = lookups.currentModel(),
        store = lookups.store(),
        lineItems = model.get('lineItems.content'),
        linesCount = lineItems.get('length'),
        receivingId = store.all('receiving').get('content.length') + 5,
        receivingLineId = store.all('receivingLine').get('content.length') + 5,
        receivingLines = [],
        receivingIds = [];

    if (linesCount === 0)
      return { 'receiving': null, 'receiving_lines': [] };

    for( var i = 0; i < linesCount; i++) {
      var lineItem = lineItems[i],
          id = receivingLineId + i,
          quantity = lineItem.get('quantity') - lineItem.get('receivedCount');

      if (quantity > 0) {
        receivingLines.push({ 'id': id,
                              'quantity': quantity,
                              'line_item_id': lineItem.id,
                              'receiving_id': receivingId });
        receivingIds.push(id);
      }
    }

    var a_test_response = { 'receiving': { 'id': receivingId,
                                           'purchase_id': model.get('id'),
                                           'receiving_line_ids': receivingIds },
                            'receiving_lines': receivingLines };

    this.addMock(App.getUrl('/purchases/1/receive_all'), function(data){
      return a_test_response;
    });
  },


  setupMockSearch: function() {
    var a_test_response = { purchases: Ember.copy(App.Purchase.FIXTURES_BASE, true) };

    this.addMock(App.getUrl('/search'), function(data){
      return a_test_response;
    });
  }
};



// Setup mock for ajax
$.ajax = function(params) {
  var self = this,
      mock = null;
  console.log('AJAX running');
  console.log(params);

  myMocks.numCalls += 1;

  if (params && params.url)
    mock = myMocks.canMock(params.url);
  else
    mock = myMocks.canMock(params);

  myMocks.ajaxParams = params;

  return new Ember.RSVP.Promise(function(resolve, reject){
    Ember.run.later(function() {
      var result = null;

      if (mock && Ember.typeOf(mock.block) === 'function')
        result = mock.block(params.data);

      if (mock.type && mock.type === 'error')
        reject(result);
      else
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


// Setup mock for window.open()
window.open = function(url) {
  myMocks.url = url;
};
