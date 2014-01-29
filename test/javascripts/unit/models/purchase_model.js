
module('PurchaseModel', {
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


test('TaxRateDisplay mirrors tax_rate', function(){
  expect(1);
  var model = helperMethods.model('purchase');

  Ember.run(function(){
    model.set('tax_rate', '%10.0');
  });

  andThen(function(){
    equal(model.get('taxRateDisplay'), model.get('tax_rate'), 'The model mirrors the display value');
  });
});


test('TaxRateDisplay defaults to %0.0', function(){
  expect(1);
  var model = helperMethods.model('purchase');

  Ember.run(function(){
    model.set('tax_rate', null);
  });

  andThen(function(){
    equal(model.get('taxRateDisplay'), '%0.0', 'An empty tax_rate displays %0.0');
  });
});