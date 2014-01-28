
App.rootElement = '#ember-app-root';
App.setupForTesting();

Ember.FEATURES['ember-testing-routing-helpers'] = true;

DS.Model.reopen({
  can_update: true,
  can_create: true,
  can_delete: true
});
