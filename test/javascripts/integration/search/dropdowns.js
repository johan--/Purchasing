
module('Integration - Search - Dropdowns', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/');
  },

  teardown: function() {
  }
});


test('Search shortcuts', function() {
  expect(12);
  click(buttons.searchAdvancedIcon);
  var min = find(buttons.searchAdvancedRequestedMin),
      max = find(buttons.searchAdvancedRequestedMax),
      weeks = null;

  // Two weeks ago
  change(buttons.searchAdvancedRequestedShortcut, 'Two weeks ago').then(function() {

    equal(find(buttons.searchAdvancedRequestedMin).val(), moment().day(-14).format(App.Globals.DATE_STRING), 'Two weeks ago min');
    equal(find(buttons.searchAdvancedRequestedMax).val(), moment().day(-8).format(App.Globals.DATE_STRING), 'Two weeks ago max');

    return change(buttons.searchAdvancedRequestedShortcut, 'Last week');

  }).then(function() {

    equal(find(buttons.searchAdvancedRequestedMin).val(), moment().day(-7).format(App.Globals.DATE_STRING), 'Last week min');
    equal(find(buttons.searchAdvancedRequestedMax).val(), moment().day(-1).format(App.Globals.DATE_STRING), 'Last week max');

    return change(buttons.searchAdvancedRequestedShortcut, 'This week');

  }).then(function() {

    equal(find(buttons.searchAdvancedRequestedMin).val(), moment().day(0).format(App.Globals.DATE_STRING), 'This week min');
    equal(find(buttons.searchAdvancedRequestedMax).val(), moment().day(6).format(App.Globals.DATE_STRING), 'This week max');

    return change(buttons.searchAdvancedRequestedShortcut, 'Two months ago');

  }).then(function() {

    equal(find(buttons.searchAdvancedRequestedMin).val(), moment().subtract('months', 2).date(1).format(App.Globals.DATE_STRING), 'Two months ago min');
    equal(find(buttons.searchAdvancedRequestedMax).val(), moment().subtract('months', 1).date(1).subtract('day', 1).format(App.Globals.DATE_STRING), 'Two months ago max');

    return change(buttons.searchAdvancedRequestedShortcut, 'Last month');

  }).then(function() {

    equal(find(buttons.searchAdvancedRequestedMin).val(), moment().subtract('months', 1).date(1).format(App.Globals.DATE_STRING), 'Last month min');
    equal(find(buttons.searchAdvancedRequestedMax).val(), moment().date(1).subtract('day', 1).format(App.Globals.DATE_STRING), 'Last month max');

    return change(buttons.searchAdvancedRequestedShortcut, 'This month');

  }).then(function() {

    equal(find(buttons.searchAdvancedRequestedMin).val(), moment().date(1).format(App.Globals.DATE_STRING), 'This month min');
    equal(find(buttons.searchAdvancedRequestedMax).val(), moment().add('months', 1).date(1).subtract('day', 1).format(App.Globals.DATE_STRING), 'This month max');

  });
});
