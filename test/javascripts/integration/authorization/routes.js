
module('Authorization - Routes', {
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

  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['employee']);
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    equal(helperMethods.path(), 'purchase.show', 'Visiting purchase.edit redirects to purchase.show');

  });
});


test('As an employee - Purchase New', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['employee']);
    });

    return visit('/purchases/new');

  }).then(function(){

    equal(helperMethods.path(), 'purchases.tabs', 'Visiting purchase.new redirects to purchases.tabs');

  });
});


test('As an receiver - Vendors', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    return visit('/vendors');

  }).then(function(){

    equal(helperMethods.path(), 'purchases.tabs', 'Visiting vendors redirects to purchases.tabs');

  });
});


test('As an receiver - Users', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    return visit('/users');

  }).then(function(){

    equal(helperMethods.path(), 'purchases.tabs', 'Visiting users redirects to purchases.tabs');

  });
});


test('As an receiver - Purchase Edit', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['receiver']);
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    equal(helperMethods.path(), 'purchase.show', 'Visiting purchase.edit redirects to purchase.show');

  });
});



test('As an receiver - Purchase New', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['receiver']);
    });

    return visit('/purchases/new');

  }).then(function(){

    equal(helperMethods.path(), 'purchases.tabs', 'Visiting purchase.new redirects to purchases.tabs');

  });
});


test('As an buyer - Vendors', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return visit('/vendors');

  }).then(function(){

    equal(helperMethods.path(), 'vendors', 'Visiting vendors works');

  });
});


test('As an buyer - Users', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return visit('/users');

  }).then(function(){

    equal(helperMethods.path(), 'users', 'Visiting users works');

  });
});


test('As an buyer - Purchase Edit', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    equal(helperMethods.path(), 'purchase.edit', 'Visiting purchase.edit works');

  });
});


test('As an buyer - Purchase New', function(){
  expect(1);

  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');
    Ember.run(function(){
      model.set('can_update', null);
      App.current_user.set('roles', ['buyer']);
    });

    return visit('/purchases/new');

  }).then(function(){

    equal(helperMethods.path(), 'purchase.new', 'Visiting purchase.new redirects to purchase.new');

  });
});
