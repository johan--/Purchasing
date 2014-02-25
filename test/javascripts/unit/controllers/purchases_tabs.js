var testView = null;

module('Unit - Controllers - Purcahses Tabs', {
  setup: function() {
    // Hacky way to get current instance of view
    App.PurchaseHoverDocView.reopen({
      didInsertElement: function() {
        testView = this;
        this.$().css('visibility', 'hidden');
      }
    });

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/tabs?tab=Purchased');
  },

  teardown: function() {
    var testView = null;
  }
});


test('Click show button sets hoverDoc', function() {
  expect(1);
  var model = lookups.currentModel().get('content.firstObject'),
      controller = lookups.controller('purchases.tabs');

  click(find(buttons.purchasesHoverStart)[0]);

  andThen(function() {
    equal(controller.get('hoverDoc'), model, 'Clicking the first hover button sets hoverDoc on the controller');
  });
});


test('Clicking show button twice clears hoverDoc', function() {
  expect(1);
  var controller = lookups.controller('purchases.tabs');

  click(find(buttons.purchasesHoverStart)[0]);
  click(find(buttons.purchasesHoverStart)[0]);

  andThen(function() {
    equal(controller.get('hoverDoc'), null, 'Clicking the first hover button twice clears hoverDoc on the controller');
  });
});


test('Clicking show button once on one line, then on another correctly sets hoverDoc', function() {
  expect(1);
  var model = lookups.currentModel().get('content').objectAt(1),
      controller = lookups.controller('purchases.tabs');

  click(find(buttons.purchasesHoverStart)[0]);
  click(find(buttons.purchasesHoverStart)[1]);

  andThen(function() {
    equal(controller.get('hoverDoc'), model, 'Clicking the second hover button sets hoverDoc on the controller');
  });
});


test('Changing tabs clears hoverDoc', function() {
  expect(1);
  var controller = lookups.controller('purchases.tabs');

  click(find(buttons.purchasesHoverStart)[0]);
  visit('/purchases/1/edit');

  andThen(function() {
    equal(controller.get('hoverDoc'), null, 'Changing route clears hoverDoc on the controller');
  });
});


test('Close button clears hoverDoc', function() {
  expect(1);
  var controller = lookups.controller('purchases.tabs');

  click(find(buttons.purchasesHoverStart)[0]);
  click(find(buttons.purchasesHoverClose)[0]);

  andThen(function() {
    equal(controller.get('hoverDoc'), null, 'Closing the window clears hoverDoc');
  });
});


test('hoverDoc Binding between purchases controller and view', function() {
  expect(9);
  var model = lookups.currentModel().get('firstObject'),
      controller = lookups.controller('purchases.tabs');

  // Don't test initial values because both view and controller get instance of array controller
  ok(!isEmpty(model), 'The model is not empty');

  Ember.run(function() {
    controller.set('hoverDoc', model);
  });
  equal(testView.get('content'), model, 'After setting the containsoller the view is set');
  notContains(testView.$().attr('class'), 'invisible', 'The view is visible');

  Ember.run(function() {
    controller.set('hoverDoc', null);
  });
  equal(isEmpty(testView.get('content')), true, 'After clearing the controller the view is cleared');
  contains(testView.$().attr('class'), 'invisible', 'The view is hidden');

  Ember.run(function() {
    testView.set('content', model);
  });
  equal(controller.get('hoverDoc'), model, 'After setting the view the controller is set');
  notContains(testView.$().attr('class'), 'invisible', 'The view is visible');

  Ember.run(function() {
    testView.set('content', null);
  });
  equal(isEmpty(controller.get('hoverDoc')), true, 'After clearing the view the controller is cleared');
  contains(testView.$().attr('class'), 'invisible', 'The view is hidden');

});


test('hoverDoc Binding between search controller and view', function() {
  expect(9);
  myMocks.setupMockSearch();

  visit('/search');

  andThen(function() {

    var model = lookups.currentModel().get('firstObject'),
        controller = lookups.controller('search');

    // Don't test initial values because both view and controller get instance of array controller

    ok(!isEmpty(model), 'The model is not empty');

    Ember.run(function() {
      controller.set('hoverDoc', model);
    });
    equal(testView.get('content'), model, 'After setting the controller the view is set');
    notContains(testView.$().attr('class'), 'invisible', 'The view is visible');

    Ember.run(function() {
      controller.set('hoverDoc', null);
    });
    equal(isEmpty(testView.get('content')), true, 'After clearing the controller the view is cleared');
    contains(testView.$().attr('class'), 'invisible', 'The view is hidden');

    Ember.run(function() {
      testView.set('content', model);
    });
    equal(controller.get('hoverDoc'), model, 'After setting the view the controller is set');
    notContains(testView.$().attr('class'), 'invisible', 'The view is visible');

    Ember.run(function() {
      testView.set('content', null);
    });
    equal(isEmpty(controller.get('hoverDoc')), true, 'After clearing the view the controller is cleared');
    contains(testView.$().attr('class'), 'invisible', 'The view is hidden');

  });
});
