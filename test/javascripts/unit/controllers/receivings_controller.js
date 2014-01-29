
module('ReceivingsController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }
});


test('Receive All does not break relationships', function(){
  expect(0);

  var line1 = helperMethods.createLine(1, 5),
      line2 = helperMethods.createLine(2, 5),
      rec1 = helperMethods.createReceiving(line1, 1),
      recLine1 = rec1.get('receivingLines.firstObject');

  var a_test_response =
    { "purchase": { "id": 1, "received": true,
                    "buyer": { "id": 3, "name": "Irene Moonitz" },
                    "requester": { "id": 4, "name": "A test person"},
                    "recipient": { "id": 4, "name": "A test person"},
                    "vendor_ids": [1],
                    "line_item_ids": [1, 2],
                    "receiving_ids": [rec1.id, 11] },
      "vendors": [{ "id": 1, "name": "A test vendor" }],
      "line_items": [{ "id": 1, "description": "Item #1", "quantity": 5, "purchase_id": 1033,
                       "received_count_server": 5, "receiving_line_ids": [5, recLine1.id]},
                     { "id": 2, "description": "Item #2", "quantity": 5, "purchase_id": 1033,
                       "received_count_server": 5, "receiving_line_ids": [6]}],
      "receivings": [{ "id": 11, "total": 11, "purchase_id": 1, "receiving_line_ids": [5, 6] },
                     { "id": rec1.id, "total": 1, "purchase_id": 1, "receiving_line_ids": [recLine1.id] }],
      "receiving_lines":[{ "id": 5, "quantity": 4, "line_item_id": 1, "receiving_id": 11 },
                         { "id": 6, "quantity": 5, "line_item_id": 2, "receiving_id": 11 },
                         { "id": recLine1.id, "quantity": 1, "line_item_id": 1, "receiving_id": rec1.id }] };




  mockUrls.addMock('/purchases/1/receive_all', function(data){
    return a_test_response;
  });
});
