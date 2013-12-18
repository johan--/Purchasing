
var testController = null;

module('PurchasesController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
    testController = helperMethods.controller('purchases');
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});


test('Metadata observes purchases.tabs controller', function(){
  visit('/').then(function(){
    var tabsController = testController.purchases;

    equal(testController.get('metadata.tab'), tabsController.get('metadata.tab'), 'Initially they mirror');

    tabsController.set('metadata.tab', 'ANewTabThatDoesntExist');
    equal(testController.get('metadata.tab'), 'ANewTabThatDoesntExist', 'After updating tabsController, they still mirror');
  });
});

test('CanTabs are boolean based on metadata', function(){
  visit('/').then(function(){
    // TODO: Why are the computed properties always returning false?  Otherwise this test is kind of pointless
    // Still going to use the observer just to make sure it works under use
    var tabsController = testController.purchases;

    tabsController.set('metadata.tab', 'New');
    equal(testController.canTab('New'), true, 'Can tab new');

    tabsController.set('metadata.tab', 'Pending');
    equal(testController.canTab('Pending'), true, 'Can tab Pending');

    tabsController.set('metadata.tab', 'Purchased');
    equal(testController.canTab('Purchased'), true, 'Can tab Purchased');

    tabsController.set('metadata.tab', 'Reconciled');
    equal(testController.canTab('Reconciled'), true, 'Can tab Reconciled');

    tabsController.set('metadata.tab', 'Cancelled');
    equal(testController.canTab('Cancelled'), true, 'Can tab Cancelled');

    tabsController.set('metadata.tab', 'Starred');
    equal(testController.canTab('Starred'), true, 'Can tab Starred');

  });
});
