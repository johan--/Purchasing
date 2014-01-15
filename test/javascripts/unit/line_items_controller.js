
module('LineItemsController', {
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

test('Creating a receiving_line from line_item buttons matches the ID of both the line_item and edited receiving_doc', function(){
  // This is only testing the relationships between records that have ID's

  var lineItem = helperMethods.createLine(),
      lineItem2 = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[2]);

  andThen(function(){
    var rec_line = helperMethods.model('purchase').get('receivings.firstObject.receivingLines.lastObject');

    equal(rec_line.get('lineItem.id'), lineItem2.id, 'Created receiving_line builds a relationship with line_item');
    equal(rec_line.get('receiving.id'), recItem.id, 'Created receiving_line builds a relationship with line_item');
  });
});
