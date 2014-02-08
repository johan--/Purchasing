
module('Purchases-Sort', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/tabs?tab=Purchased');
  },

  teardown: function() {

  }
});


test('-Purchases field sorters', function(){
  expect(25);
  var metadata = getMetadataFor('purchase');

  // Buyer Cell
  click(buttons.buyerHeaderCell).then(function(){
    equal(metadata.sort, 'buyer.name', 'Click buyer should sort by buyer');
    equal(metadata.direction, 'ASC', 'Click buyer first time should sort ASC');
    contains(find(buttons.buyerHeaderArrow).attr('class'), 'fa-sort-up', 'Buyer sort up arrow is showing');

    return click(buttons.buyerHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click buyer second time should sort DESC');
    contains(find(buttons.buyerHeaderArrow).attr('class'), 'fa-sort-down', 'Buyer sort down arrow is showing');


  // Date Cell
    return click(buttons.dateHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'dateRequested', 'Click date should sort by date');
    equal(metadata.direction, 'DESC', 'Click date first time should sort ASC');
    contains(find(buttons.dateHeaderArrow).attr('class'), 'fa-sort-down', 'dateRequested sort down arrow is showing');

    return click(buttons.dateHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'ASC', 'Click date second time should sort DESC');
    contains(find(buttons.dateHeaderArrow).attr('class'), 'fa-sort-up', 'dateRequested sort up arrow is showing');


  // Vendor Cell
    return click(buttons.vendorHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'vendor_string', 'Click vendor should sort by vendor');
    equal(metadata.direction, 'ASC', 'Click vendor first time should sort ASC');
    contains(find(buttons.vendorHeaderArrow).attr('class'), 'fa-sort-up', 'Vendor sort up arrow is showing');

    return click(buttons.vendorHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click vendor second time should sort DESC');
    contains(find(buttons.vendorHeaderArrow).attr('class'), 'fa-sort-down', 'Vendor sort down arrow is showing');


  // Requester Cell
    return click(buttons.requesterHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'requester.name', 'Click requester should sort by requester');
    equal(metadata.direction, 'ASC', 'Click requester first time should sort ASC');
    contains(find(buttons.requesterHeaderArrow).attr('class'), 'fa-sort-up', 'Requester sort up arrow is showing');

    return click(buttons.requesterHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click requester second time should sort DESC');
    contains(find(buttons.requesterHeaderArrow).attr('class'), 'fa-sort-down', 'Requester sort down arrow is showing');


  // Department Cell
    return click(buttons.departmentHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'requester.department', 'Click department should sort by department');
    equal(metadata.direction, 'ASC', 'Click department first time should sort ASC');
    contains(find(buttons.departmentHeaderArrow).attr('class'), 'fa-sort-up', 'Department sort up arrow is showing');

    return click(buttons.departmentHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click department second time should sort DESC');
    contains(find(buttons.departmentHeaderArrow).attr('class'), 'fa-sort-down', 'Department sort down arrow is showing');

  });
});


test('Sort order ascending without star', function(){
  expect(3);
  var controller = lookupController('purchases.tabs');
  visit('/purchases/tabs?tab=Purchased&direction=ASC&sort=dateRequested');

  andThen(function(){
    equal(controller.objectAtContent(0).get('id'), 5, 'The fifth record is first');
    equal(controller.objectAtContent(1).get('id'), 4, 'The fourth record is second');
    equal(controller.objectAtContent(2).get('id'), 3, 'The third record is third');
  });
});


test('Sort order descending without a star', function(){
  expect(3);
  var controller = lookupController('purchases.tabs');
  visit('/purchases/tabs?tab=Purchased&direction=DESC&sort=dateRequested');

  andThen(function(){
    equal(controller.objectAtContent(0).get('id'), 1, 'The first record is first');
    equal(controller.objectAtContent(1).get('id'), 2, 'The second record is second');
    equal(controller.objectAtContent(2).get('id'), 3, 'The third record is third');
  });
});


test('Sort order ascending with a star', function(){
  expect(3);
  var controller = lookupController('purchases.tabs'),
      content = controller.get('content.content');

  visit('/purchases/tabs?tab=Purchased&direction=ASC&sort=dateRequested');

  Ember.run(function(){
    content[2].set('starred', 'test');
  });

  andThen(function(){
    equal(controller.objectAtContent(0).get('id'), 3, 'The third record is first');
    equal(controller.objectAtContent(1).get('id'), 5, 'The fifth record is second');
    equal(controller.objectAtContent(2).get('id'), 4, 'The fourth record is third');
  });
});


test('Sort order descending with a star', function(){
  expect(3);
  var controller = lookupController('purchases.tabs'),
      content = controller.get('content.content');

  visit('/purchases/tabs?tab=Purchased&direction=DESC&sort=dateRequested');

  Ember.run(function(){
    content[2].set('starred', 'test');
  });

  andThen(function(){
    equal(controller.objectAtContent(0).get('id'), 3, 'The third record is first');
    equal(controller.objectAtContent(1).get('id'), 1, 'The first record is second');
    equal(controller.objectAtContent(2).get('id'), 2, 'The secnod record is third');
  });
});
