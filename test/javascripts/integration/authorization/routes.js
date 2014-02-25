
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


['employee', 'receiver', 'buyer'].forEach(function(role) {

  function setRoles() {
    Ember.run(function() {
      App.current_user.set('roles', [role]);
    });
  }


  function testRoute(route, redirect) {
    redirect_route = redirect || 'purchases.tabs';

    if (role === 'buyer')
      equal(lookups.path(), route, 'Visiting ' + route + ' does not redirect');
    else
      equal(lookups.path(), redirect_route, 'Visiting ' + route + ' redirects to purchases.tabs');
  }

  test('As an ' + role + ' - Vendors', function() {
    expect(1);
    setRoles();
    visit('/vendors');

    andThen(function() {
      testRoute('vendors');
    });
  });


  test('As an ' + role + ' - Users', function() {
    expect(1);
    setRoles();
    visit('/users');

    andThen(function() {
      testRoute('users');
    });
  });


  test('As an ' + role + ' - Purchase Edit', function() {
    expect(1);
    setRoles();
    visit('/purchases/tabs?tab=Purchased').then(function() {

      var model = lookups.currentModel().get('firstObject');
      Ember.run(function() {
        model.set('can_update', (role === 'buyer') ? true : false);
      });

      return visit('/purchases/1/edit');

    }).then(function() {
      testRoute('purchase.edit', 'purchase.show');
    });
  });


  test('As an ' + role + ' - Purchase New', function() {
    expect(1);
    setRoles();
    visit('/purchases/new');

    andThen(function() {
      testRoute('purchase.new');
    });
  });


  test('As an ' + role + ' - Attachments', function() {
    expect(1);
    setRoles();
    visit('/attachments');

    andThen(function() {
      testRoute('attachments');
    });
  });
});
