
App.rootElement = '#ember-app-root';
App.setupForTesting();

Ember.FEATURES['ember-testing-routing-helpers'] = true;

DS.Model.reopen({
  can_update: true,
  can_create: true,
  can_delete: true
});

App.Session.currentUser.set('id', 55);
App.Session.currentUser.set('username', 'johndoe');
App.Session.currentUser.set('name', 'John Doe');
App.Session.currentUser.set('email', 'myName@someplace.org');
App.Session.currentUser.set('phone', '542-231-5151');
App.Session.currentUser.set('department', 'department');
App.Session.currentUser.set('roles', ['admin']);
App.Session.currentUser.set('photo_url', 'http://');
