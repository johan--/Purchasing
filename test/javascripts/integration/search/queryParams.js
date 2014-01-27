
module('Search - QueryParams', {
  setup: function() {
    mockResults.clearMockResults();

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

  },

  teardown: function() {
  }
});


test('Binding between queryParams and quickSearch', function(){
  expect(1);
  visit('/search?search[purSearch]=1&search[searchPage]=5');

  andThen(function(){
    equal(find(buttons.searchBoxInput).val(), '1', 'quickSearch field is set to 1');
  });
});


test('Doing a quick search clears queryParams', function(){
  expect(12);
  visit('/search?search[searchPage]=2&search[lines]=1&search[dateExpectedMax]=1' +
        '&search[dateExpectedMin]=1&search[datePurchasedMax]=1&search[datePurchasedMin]=1' +
        '&search[dateRequestedMax]=1&search[dateRequestedMin]=1&search[buyer]=1' +
        '&search[requester]=1&search[vendor]=1');

  fillIn(buttons.searchBoxInput, 'testing');
  click(buttons.searchStart);

  andThen(function(){
    var controller = helperMethods.controller('search');

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
    equal(controller.get('includeReceived'), null, 'The includeReceived field is clear');
  });
});


test('Binding between queryParams and advanced search fields', function(){
  expect(11);
  visit('/search?search[searchPage]=2&search[lines]=1&search[dateExpectedMax]=Jan%2027%2C%202014' +
        '&search[dateExpectedMin]=Jan%2027%2C%202014&search[datePurchasedMax]=Jan%2027%2C%202014' +
        '&search[datePurchasedMin]=Jan%2027%2C%202014&search[dateRequestedMax]=Jan%2027%2C%202014' +
        '&search[dateRequestedMin]=Jan%2027%2C%202014&search[buyer]=1' +
        '&search[requester]=1&search[vendor]=1&search[includeReceived]');

  click(buttons.searchAdvancedIcon);

  andThen(function(){
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
  });
});


test('Doing an advanced search clears queryParams', function(){
  expect(12);
  visit('/search?search[purSearch]=1&search[searchPage]=5');

  mockResults.addMockToController('search');
  click(buttons.searchAdvancedIcon).then(function(){

    $('.advanced_search_box').find('input').each(function(i, el){
      $(this).val('1');
    });
    find(buttons.searchAdvancedIncludeReceived).prop('checked', true);

    return click(buttons.searchAdvancedStart);

  }).then(function(){
    var controller = helperMethods.controller('search');

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
    equal(controller.get('vendor'), '1', 'The vendor field is set');
    equal(controller.get('includeReceived'), true, 'The includeReceived field is clear');
  });
});
