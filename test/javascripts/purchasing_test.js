
App.rootElement = '#ember-app-root';
App.setupForTesting();

// https://github.com/emberjs/data/blob/master/TRANSITION.md
// Most of the guides online will not reflect the newest Ember Data on how to setup the adapter
App.ApplicationAdapter = DS.FixtureAdapter.extend({

  // http://stackoverflow.com/questions/16753150/unable-to-query-emberjs-model-when-using-ds-fixtureadapter
  // It doesn't make any sense why this has to be implemented, but it currently is required
  queryFixtures: function(fixtures, query, type) {

    return fixtures.filter(function(item) {
      for(prop in query) {
        if( item[prop] != query[prop]) {
          return false;
        }
      }

      // Build metadata (TODO: this isn't working)
      var new_metadata = Ember.merge(query, META_FIXTURE);
      Ember.merge(store().typeMapFor(type).metadata, new_metadata)

      return true;
    });
  }
});

// Run before each test case.
QUnit.testStart(function () {
  Ember.run(function () { App.reset(); });
  Ember.testing = true;
});

// Run after each test case.
QUnit.testDone(function () {
  Ember.testing = false;
});
