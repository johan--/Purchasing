
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

  var model = helperMethods.model(),
      line1 = helperMethods.createLine(1, 5),
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
      "receivings": [{ "id": rec1.id, "total": 1, "purchase_id": 1, "receiving_line_ids": [recLine1.id] },
                     { "id": 11, "total": 9, "purchase_id": 1, "receiving_line_ids": [5, 6] }],
      "receiving_lines":[{ "id": 5, "quantity": 4, "line_item_id": 1, "receiving_id": 11 },
                         { "id": 6, "quantity": 5, "line_item_id": 2, "receiving_id": 11 },
                         { "id": recLine1.id, "quantity": 1, "line_item_id": 1, "receiving_id": rec1.id }] };

  mockUrls.addMock('/purchases/1/receive_all', function(data){
    return a_test_response;
  });

  click(buttons.receiveAll);

  andThen(function(){
    var rec2 = model.get('receivings.content.lastObject'),
        recLine2 = rec2.get('receivingLines.firstObject'),
        recLine3 = rec2.get('receivingLines.lastObject');

    equal(model.get('received'), true, 'Model is flagged as all received');
    equal(model.get('isDirty'), false, 'Model is not dirty');

    equal(line1.get('received_count_server'), 5, 'Line 1 has the correct server count');
    equal(line1.get('receivedCount'), 5, 'Line 1 has the correct internal received count');

    equal(line2.get('received_count_server'), 5, 'Line 2 has the correct server count');
    equal(line2.get('receivedCount'), 5, 'Line 2 has the correct internal received count');

    //equal(rec1.get('isDirty'), false, 'rec1 is unchanged');
    equal(rec1.get('total'), 1, 'Rec 1 server total count is correct');
    equal(rec1.get('totalCount'), 1, 'Rec 1 internal total count is correct');

    equal(rec2.get('isDirty'), false, 'Rec 2 is unchanged');
    equal(rec2.get('total'), 9, 'Rec 2 server total count is correct');
    equal(rec2.get('totalCount'), 9, 'Rec 2 internal total count is correct');

    equal(recLine1.get('quantity'), 1, 'ReceivingLine 1 is unchanged');
    //equal(recLine1.get('isDirty'), false, 'ReceivingLine 1 is not dirty');

    equal(recLine2.get('quantity'), 4, 'ReceivingLine 2 is correct');
    equal(recLine2.get('isDirty'), false, 'ReceivingLine 2 is not dirty');

    equal(recLine3.get('quantity'), 5, 'ReceivingLine 3 is correct');
    equal(recLine3.get('isDirty'), false, 'ReceivingLine 3 is not dirty');

    // Drilling
    equal(model.get('lineItems.firstObject').get('receivingLines.lastObject').get('receiving.id'),
          rec1.get('id'), ' LineItems[0] > receivingLines[1] > receiving = rec1');

    equal(model.get('receivings.firstObject').get('receivingLines.firstObject').get('lineItem.id'),
          line1.get('id'), ' Model > Receivings[0] > receivingLines[0] > lineItem = line1');

    equal(model.get('receivings.lastObject').get('receivingLines.firstObject').get('lineItem.id'),
          line1.get('id'), ' Model > Receivings[1] > receivingLines[0] > lineItem = line1');

    equal(model.get('receivings.lastObject').get('receivingLines.lastObject').get('lineItem.id'),
          line2.get('id'), ' Model > Receivings[1] > receivingLines[0] > lineItem = line2');

  });
});


test('Receive All gives an error if the purchase isDirty', function(){
  expect(0);
});


test('Receive All gives an error if their are any dirty receiving documents', function(){
  expect(0);
});
