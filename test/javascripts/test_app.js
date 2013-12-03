
App.rootElement = '#ember-app-root';
App.setupForTesting();

// Run before each test case.
QUnit.testStart(function () {
  Ember.run(function () { App.reset(); });
  Ember.testing = true;
});

// Run after each test case.
QUnit.testDone(function () {
  Ember.testing = false;
});
