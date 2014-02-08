
module('FindOrCreate', {
  setup: function() {
    // Build fixtures
    injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }
});


test('It can find an existing object', function() {
  expect(1);
  var store = lookupStore(),
      model = currentModel(),
      result = null;

  Ember.run(function(){
    store.push('tag', { id: 55, name: 'A test tag' });
    result = store.findOrCreate('tag', { id: 55 });
  });

  equal(result.get('name'), 'A test tag', 'The correct tag is returned');
});


test('It can create a new object', function() {
  expect(1);
  var store = lookupStore(),
      model = currentModel(),
      result = null;

  Ember.run(function(){
    store.push('tag', { id: 55, name: 'A test tag' });
    result = store.findOrCreate('tag', { id: 56, name: 'Another tag' });
  });

  equal(result.get('name'), 'Another tag', 'The correct tag is returned');
});


test('It returns null if id is not given', function() {
  expect(1);
  var store = lookupStore(),
    model = currentModel(),
    result = null;

  Ember.run(function() {
    result = store.findOrCreate('tag', { id: null, name: 'A bad tag' });
  });

  equal (result, null, 'It returns null if no id is sent');
});