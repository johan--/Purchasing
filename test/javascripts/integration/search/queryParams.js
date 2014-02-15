
module('Integration - Search - QueryParams', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

  },

  teardown: function() {
  }
});


test('Field binding between queryParams and quickSearch', function(){
  expect(12);
  visit('/search?purSearch=1&searchPage=5');

  click(buttons.searchAdvancedIcon);

  andThen(function(){
    equal(find(buttons.searchBoxInput).val(), '1', 'quickSearch field is empty');

    equal(find(buttons.searchAdvancedVendor).val(), '', 'Vendor is empty');
    equal(find(buttons.searchAdvancedRequester).val(), '', 'Requester is empty');
    equal(find(buttons.searchAdvancedBuyer).val(), '', 'Buyer is empty');
    equal(find(buttons.searchAdvancedRequestedMin).val(), '', 'RequestedMin is empty');
    equal(find(buttons.searchAdvancedRequestedMax).val(), '', 'RequestedMax is empty');
    equal(find(buttons.searchAdvancedPurchasedMin).val(), '', 'PurchasedMin is empty');
    equal(find(buttons.searchAdvancedPurchasedMax).val(), '', 'PurchasedMax is empty');
    equal(find(buttons.searchAdvancedExpectedMin).val(), '', 'ExpectedMin is empty');
    equal(find(buttons.searchAdvancedExpectedMax).val(), '', 'ExpectedMax is empty');
    equal(find(buttons.searchAdvancedLines).val(), '', 'Lines is empty');
    equal(find(buttons.searchAdvancedDepartment).val(), '', 'Department is empty');

  });
});


test('Doing a quick search clears queryParams', function(){
  expect(14);
  visit('/search?searchPage=2&lines=1&dateExpectedMax=1' +
        '&dateExpectedMin=1&datePurchasedMax=1&datePurchasedMin=1' +
        '&dateRequestedMax=1&dateRequestedMin=1&buyer=1' +
        '&requester=1&vendor=1&department=1&purType=services');

  fillIn(buttons.searchBoxInput, 'testing');
  click(buttons.searchStart);

  andThen(function(){
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


test('Field bindings between queryParams and advanced search fields', function(){
  expect(14);
  visit('/search?searchPage=2&lines=1&dateExpectedMax=Jan%2027%2C%202014' +
        '&dateExpectedMin=Jan%2027%2C%202014&datePurchasedMax=Jan%2027%2C%202014' +
        '&datePurchasedMin=Jan%2027%2C%202014&dateRequestedMax=Jan%2027%2C%202014' +
        '&dateRequestedMin=Jan%2027%2C%202014&buyer=1&department=1' +
        '&requester=1&vendor=1&includeReceived&purType=services');

  click(buttons.searchAdvancedIcon);

  andThen(function(){

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


test('Doing an advanced search clears queryParams', function(){
  expect(14);
  visit('/search?purSearch=1&searchPage=5');

  myMocks.addMockToController('search');
  click(buttons.searchAdvancedIcon).then(function(){

    $('.advanced_search_box').find('input').each(function(i, el){
      $(this).val('1');
    });
    find(buttons.searchAdvancedIncludeReceived).prop('checked', true);
    find(buttons.searchAdvancedType).val('services');

    return click(buttons.searchAdvancedStart);

  }).then(function(){
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
