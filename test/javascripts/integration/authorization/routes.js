
module('Integration - Authorization - Routes', {
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


test('As an employee - Vendors', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['employee']);
  });

  visit('/vendors');

  andThen(function(){
    equal(lookups.path(), 'purchases.tabs', 'Visiting vendors redirects to purchases.tabs');
  });
});


test('As an receiver - Vendors', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['receiver']);
  });

  visit('/vendors');

  andThen(function(){

    equal(lookups.path(), 'purchases.tabs', 'Visiting vendors redirects to purchases.tabs');

  });
});


test('As an buyer - Vendors', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/vendors');

  andThen(function(){

    equal(lookups.path(), 'vendors', 'Visiting vendors does not redirect');

  });
});


test('As an employee - Users', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['employee']);
  });

  visit('/users');

  andThen(function(){
    equal(lookups.path(), 'purchases.tabs', 'Visiting users redirects to purchases.tabs');
  });
});


test('As an receiver - Users', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['receiver']);
  });

  visit('/users');

  andThen(function(){

    equal(lookups.path(), 'purchases.tabs', 'Visiting users redirects to purchases.tabs');

  });
});


test('As an buyer - Users', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/users');

  andThen(function(){

    equal(lookups.path(), 'users', 'Visiting users does not redirect');

  });
});


test('As an employee - Purchase Edit', function(){
  expect(1);

  visit('/purchases/tabs?tab=Purchased').then(function(){

    var model = lookups.currentModel().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['employee']);
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    equal(lookups.path(), 'purchase.show', 'Visiting purchase.edit redirects to purchase.show');

  });
});


test('As an receiver - Purchase Edit', function(){
  expect(1);

  visit('/purchases/tabs?tab=Purchased').then(function(){

    var model = lookups.currentModel().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['receiver']);
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    equal(lookups.path(), 'purchase.show', 'Visiting purchase.edit redirects to purchase.show');

  });
});


test('As an buyer - Purchase Edit', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/purchases/1/edit');

  andThen(function(){

    equal(lookups.path(), 'purchase.edit', 'Visiting purchase.edit does not redirect');

  });
});


test('As an employee - Purchase New', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { can_update: null });
  Ember.run(function(){
    App.current_user.set('roles', ['employee']);
  });

  visit('/purchases/new');

  andThen(function(){

    equal(lookups.path(), 'purchases.tabs', 'Visiting purchase.new redirects to purchases.tabs');

  });
});


test('As an receiver - Purchase New', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { can_update: null });
  Ember.run(function(){
    App.current_user.set('roles', ['receiver']);
  });

  visit('/purchases/new');

  andThen(function(){

    equal(lookups.path(), 'purchases.tabs', 'Visiting purchase.new redirects to purchases.tabs');

  });
});


test('As an buyer - Purchase New', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { can_update: null });

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/purchases/new');

  andThen(function(){

    equal(lookups.path(), 'purchase.new', 'Visiting purchase.new does not redirect');

  });
});


test('As an employee - Attachments', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { can_update: null });
  Ember.run(function(){
    App.current_user.set('roles', ['employee']);
  });

  visit('/attachments');

  andThen(function(){

    equal(lookups.path(), 'purchases.tabs', 'Visiting attachments redirects to purchases.tabs');

  });
});


test('As an receiver - Attachments', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { can_update: null });
  Ember.run(function(){
    App.current_user.set('roles', ['receiver']);
  });

  visit('/attachments');

  andThen(function(){

    equal(lookups.path(), 'purchases.tabs', 'Visiting attachments redirects to purchases.tabs');

  });
});


test('As an buyer - Attachments', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { can_update: null });

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/attachments');

  andThen(function(){

    equal(lookups.path(), 'purchase.new', 'Visiting attachments does not redirect');

  });
});
