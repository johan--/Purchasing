
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
