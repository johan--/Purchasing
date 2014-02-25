
module('Integration - Search - QueryParams', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

  },

  teardown: function() {
  }
});


test('Field binding between queryParams and quickSearch', function() {
  expect(12);
  visit('/search?purSearch=1&searchPage=5');

  click(buttons.searchAdvancedIcon);

  andThen(function() {
    equal(find(buttons.searchBoxInput).val(), '1', 'quickSearch field is empty');

    equal(isEmpty(find(buttons.searchAdvancedVendor).val()), true, 'Vendor is empty');
    equal(isEmpty(find(buttons.searchAdvancedRequester).val()), true, 'Requester is empty');
    equal(isEmpty(find(buttons.searchAdvancedBuyer).val()), true, 'Buyer is empty');
    equal(isEmpty(find(buttons.searchAdvancedRequestedMin).val()), true, 'RequestedMin is empty');
    equal(isEmpty(find(buttons.searchAdvancedRequestedMax).val()), true, 'RequestedMax is empty');
    equal(isEmpty(find(buttons.searchAdvancedPurchasedMin).val()), true, 'PurchasedMin is empty');
    equal(isEmpty(find(buttons.searchAdvancedPurchasedMax).val()), true, 'PurchasedMax is empty');
    equal(isEmpty(find(buttons.searchAdvancedExpectedMin).val()), true, 'ExpectedMin is empty');
    equal(isEmpty(find(buttons.searchAdvancedExpectedMax).val()), true, 'ExpectedMax is empty');
    equal(isEmpty(find(buttons.searchAdvancedLines).val()), true, 'Lines is empty');
    equal(isEmpty(find(buttons.searchAdvancedDepartment).val()), true, 'Department is empty');

  });
});


test('Doing a quick search clears queryParams', function() {
  expect(14);
  visit('/search?searchPage=2&lines=1&dateExpectedMax=1' +
        '&dateExpectedMin=1&datePurchasedMax=1&datePurchasedMin=1' +
        '&dateRequestedMax=1&dateRequestedMin=1&buyer=1' +
        '&requester=1&vendor=1&department=1&purType=services');

  fillIn(buttons.searchBoxInput, 'testing');
  click(buttons.searchStart);

  andThen(function() {
    var controller = lookups.controller('search');

    equal(controller.get('purSearch'), 'testing', 'The quick search field is set');
    equal(controller.get('searchPage'), 1, 'The page field is set');
    equal(controller.get('lines'), null, 'The lines field is clear');
    equal(controller.get('dateExpectedMax'), null, 'The dateExpectedMax field is clear');
    equal(controller.get('dateExpectedMin'), null, 'The dateExpectedMin field is clear');
    equal(controller.get('datePurchasedMax'), null, 'The datePurchasedMax field is clear');
    equal(controller.get('datePurchasedMin'), null, 'The datePurchasedMin field is clear');
    equal(controller.get('dateRequestedMax'), null, 'The dateRequestedMax field is clear');
    equal(controller.get('dateRequestedMin'), null, 'The dateRequestedMin field is clear');
    equal(controller.get('requester'), null, 'The requester field is clear');
    equal(controller.get('vendor'), null, 'The vendor field is clear');
    equal(controller.get('department'), null, 'The department field is clear');
    equal(controller.get('includeReceived'), null, 'The includeReceived field is clear');
    equal(controller.get('purType'), null, 'The purType field is clear');
  });
});


test('Field bindings between queryParams and advanced search fields', function() {
  expect(14);
  visit('/search?searchPage=2&lines=1&dateExpectedMax=Jan%2027%2C%202014' +
        '&dateExpectedMin=Jan%2027%2C%202014&datePurchasedMax=Jan%2027%2C%202014' +
        '&datePurchasedMin=Jan%2027%2C%202014&dateRequestedMax=Jan%2027%2C%202014' +
        '&dateRequestedMin=Jan%2027%2C%202014&buyer=1&department=1' +
        '&requester=1&vendor=1&includeReceived&purType=services');

  click(buttons.searchAdvancedIcon);

  andThen(function() {

    equal(find(buttons.searchBoxInput).val(), '', 'The quickSearch field is null');

    equal(find(buttons.searchAdvancedVendor).val(), '1', 'Vendor is set to 1');
    equal(find(buttons.searchAdvancedRequester).val(), '1', 'Requester is set to 1');
    equal(find(buttons.searchAdvancedBuyer).val(), '1', 'Buyer is set to 1');
    equal(find(buttons.searchAdvancedRequestedMin).val(), 'Jan 27, 2014', 'RequestedMin is set to Jan 27, 2014');
    equal(find(buttons.searchAdvancedRequestedMax).val(), 'Jan 27, 2014', 'RequestedMax is set to Jan 27, 2014');
    equal(find(buttons.searchAdvancedPurchasedMin).val(), 'Jan 27, 2014', 'PurchasedMin is set to Jan 27, 2014');
    equal(find(buttons.searchAdvancedPurchasedMax).val(), 'Jan 27, 2014', 'PurchasedMax is set to Jan 27, 2014');
    equal(find(buttons.searchAdvancedExpectedMin).val(), 'Jan 27, 2014', 'ExpectedMin is set to Jan 27, 2014');
    equal(find(buttons.searchAdvancedExpectedMax).val(), 'Jan 27, 2014', 'ExpectedMax is set to Jan 27, 2014');
    equal(find(buttons.searchAdvancedIncludeReceived).prop('checked'), true, 'IncludeReceived is checked');
    equal(find(buttons.searchAdvancedLines).val(), '1', 'Lines is set to 1');
    equal(find(buttons.searchAdvancedType).val(), 'services', 'Purchase Type is set to services');
    equal(find(buttons.searchAdvancedDepartment).val(), '1', 'Department is set to 1');
  });
});


test('Doing an advanced search clears queryParams', function() {
  expect(14);
  visit('/search?purSearch=1&searchPage=5');

  myMocks.addMockToController('search');
  click(buttons.searchAdvancedIcon).then(function() {

    $('.advanced_search_box').find('input').each(function(i, el){
      fillIn($(this), '1');
    });
    fillIn(buttons.searchAdvancedId, null); // Don't test ID field
    fillIn(buttons.searchAdvancedType, 'services');
    click(buttons.searchAdvancedIncludeReceived);

    return click(buttons.searchAdvancedStart);

  }).then(function() {
    var controller = lookups.controller('search');

    equal(controller.get('purSearch'), null, 'The quick search field is null');
    equal(controller.get('searchPage'), 1, 'The page field is set');
    equal(controller.get('lines'), '1', 'The lines field is set');
    equal(controller.get('dateExpectedMax'), '1', 'The dateExpectedMax field is set');
    equal(controller.get('dateExpectedMin'), '1', 'The dateExpectedMin field is set');
    equal(controller.get('datePurchasedMax'), '1', 'The datePurchasedMax field is set');
    equal(controller.get('datePurchasedMin'), '1', 'The datePurchasedMin field is set');
    equal(controller.get('dateRequestedMax'), '1', 'The dateRequestedMax field is set');
    equal(controller.get('dateRequestedMin'), '1', 'The dateRequestedMin field is set');
    equal(controller.get('requester'), '1', 'The requester field is set');
    equal(controller.get('department'), '1', 'The department field is set');
    equal(controller.get('vendor'), '1', 'The vendor field is set');
    equal(controller.get('includeReceived'), true, 'The includeReceived field is set');
    equal(controller.get('purType'), 'services', 'The purchase type field is set');
  });
});


test('Entering an ID clears all params and redirects', function() {
  expect(15);
  visit('/search?searchPage=2&lines=1&dateExpectedMax=Jan%2027%2C%202014' +
          '&dateExpectedMin=Jan%2027%2C%202014&datePurchasedMax=Jan%2027%2C%202014' +
          '&datePurchasedMin=Jan%2027%2C%202014&dateRequestedMax=Jan%2027%2C%202014' +
          '&dateRequestedMin=Jan%2027%2C%202014&buyer=1&department=1' +
          '&requester=1&vendor=1&includeReceived&purType=services');

  click(buttons.searchAdvancedIcon).then(function() {

    fillIn(buttons.searchAdvancedId, 5);

    return click(buttons.searchAdvancedStart);

  }).then(function() {
    var controller = lookups.controller('search');

    equal(controller.get('searchId'), 5, 'The ID is sent');
    equal(controller.get('purSearch'), null, 'The quick search field is null');
    equal(controller.get('searchPage'), 1, 'The page field is null');
    equal(controller.get('lines'), null, 'The lines field is null');
    equal(controller.get('dateExpectedMax'), null, 'The dateExpectedMax field is null');
    equal(controller.get('dateExpectedMin'), null, 'The dateExpectedMin field is null');
    equal(controller.get('datePurchasedMax'), null, 'The datePurchasedMax field is null');
    equal(controller.get('datePurchasedMin'), null, 'The datePurchasedMin field is null');
    equal(controller.get('dateRequestedMax'), null, 'The dateRequestedMax field is null');
    equal(controller.get('dateRequestedMin'), null, 'The dateRequestedMin field is null');
    equal(controller.get('requester'), null, 'The requester field is null');
    equal(controller.get('department'), null, 'The department field is null');
    equal(controller.get('vendor'), null, 'The vendor field is null');
    equal(controller.get('includeReceived'), null, 'The includeReceived field is null');
    equal(controller.get('purType'), null, 'The purchase type field is null');
  });
});


test('One result redirects', function() {
  visit('/search');

  myMocks.addMock(App.getUrl('/search'), function(data) {
    console.log(data)
    return { purchases: [{ id: 5 }] };
  });

  click(buttons.searchAdvancedIcon);
  fillIn(buttons.searchAdvancedId, 5);
  click(buttons.searchAdvancedStart);

  andThen(function() {

    equal(lookups.path(), 'purchase.show', 'The route redirected');

  });
});
