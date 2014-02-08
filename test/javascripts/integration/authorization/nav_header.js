
module('Authorization - Nav Header', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

  },

  teardown: function() {

  }
});


test('As an employee', function(){
  expect(7);
  visit('/purchases/tabs?tab=Purchased').then(function(){

    var model = currentModel().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['employee']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    exists(buttons.navBarPurchaseMaterials, 'The nav materials menu does exist');
    exists(buttons.navBarPurchaseServices, 'The nav services menu does exist');
    notExists(buttons.navBarAttachments, 'The nav attachments menu does not exist');
    notExists(buttons.navBarOptions, 'The nav options menu does not exist');
    notExists(buttons.navBarOptionsVendors, 'The nav options vendors menu does not exist');
    notExists(buttons.navBarOptionsTags, 'The nav options tag menu does not exist');
    notExists(buttons.navBarOptionsUsers, 'The nav options user menu does not exist');

  });
});


test('As a receiver', function(){
  expect(7);
  visit('/purchases/tabs?tab=Purchased').then(function(){

    var model = currentModel().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    exists(buttons.navBarPurchaseMaterials, 'The nav materials menu does exist');
    exists(buttons.navBarPurchaseServices, 'The nav services menu does exist');
    notExists(buttons.navBarAttachments, 'The nav attachments menu does not exist');
    notExists(buttons.navBarOptions, 'The nav options menu does not exist');
    notExists(buttons.navBarOptionsVendors, 'The nav options vendors menu does not exist');
    notExists(buttons.navBarOptionsTags, 'The nav options tag menu does not exist');
    notExists(buttons.navBarOptionsUsers, 'The nav options user menu does not exist');

  });
});


test('As a Buyer', function(){
  expect(7);
  visit('/purchases/tabs?tab=Purchased').then(function(){

    var model = currentModel().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    exists(buttons.navBarPurchaseMaterials, 'The nav materials menu does exist');
    exists(buttons.navBarPurchaseServices, 'The nav services menu does exist');
    exists(buttons.navBarAttachments, 'The nav attachments menu does exist');
    exists(buttons.navBarOptions, 'The nav options menu does exist');
    exists(buttons.navBarOptionsVendors, 'The nav options vendors menu does exist');
    exists(buttons.navBarOptionsTags, 'The nav options tag menu does exist');
    exists(buttons.navBarOptionsUsers, 'The nav options user menu does exist');

  });
});
