
module('Authorization - Routes', {
  setup: function() {
    mockResults.clearMockResults();

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/tabs?purchases.tabs[tab]=New');
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
    equal(helperMethods.path(), 'purchases.tabs', 'Visiting vendors redirects to purchases.tabs');
  });
});


test('As an employee - Users', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['employee']);
  });

  visit('/users');

  andThen(function(){
    equal(helperMethods.path(), 'purchases.tabs', 'Visiting users redirects to purchases.tabs');
  });
});


test('As an employee - Purchase Edit', function(){
  expect(1);

  var model = helperMethods.model().get('firstObject');
  Ember.run(function(){
    model.set('can_update', null);
    App.current_user.set('roles', ['employee']);
  });

  visit('/purchases/1/edit');

  andThen(function(){
    equal(helperMethods.path(), 'purchase.show', 'Visiting purchase.edit redirects to purchase.show');
  });
});


test('As an receiver - Vendors', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['receiver']);
  });

  visit('/vendors');

  andThen(function(){
    equal(helperMethods.path(), 'purchases.tabs', 'Visiting vendors redirects to purchases.tabs');
  });
});


test('As an receiver - Users', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['receiver']);
  });

  visit('/users');

  andThen(function(){
    equal(helperMethods.path(), 'purchases.tabs', 'Visiting users redirects to purchases.tabs');
  });
});


test('As an receiver - Purchase Edit', function(){
  expect(1);

  var model = helperMethods.model().get('firstObject');
  Ember.run(function(){
    model.set('can_update', null);
    App.current_user.set('roles', ['receiver']);
  });

  visit('/purchases/1/edit');

  andThen(function(){
    equal(helperMethods.path(), 'purchase.show', 'Visiting purchase.edit redirects to purchase.show');
  });
});


test('As an buyer - Vendors', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/vendors');

  andThen(function(){
    equal(helperMethods.path(), 'vendors', 'Visiting vendors works');
  });
});


test('As an buyer - Users', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/users');

  andThen(function(){
    equal(helperMethods.path(), 'users', 'Visiting users works');
  });
});


test('As an buyer - Purchase Edit', function(){
  expect(1);

  Ember.run(function(){
    App.current_user.set('roles', ['buyer']);
  });

  visit('/purchases/1/edit');

  andThen(function(){
    equal(helperMethods.path(), 'purchase.edit', 'Visiting purchase.edit works');
  });
});
