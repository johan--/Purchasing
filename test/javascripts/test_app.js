
App.rootElement = '#ember-app-root';
App.setupForTesting();

Ember.FEATURES['ember-testing-routing-helpers'] = true;

DS.Model.reopen({
  can_update: true,
  can_create: true,
  can_delete: true
});

App.current_user.set('id', 55);
App.current_user.set('username', 'johndoe');
App.current_user.set('name', 'John Doe');
App.current_user.set('email', 'myName@someplace.org');
App.current_user.set('phone', '542-231-5151');
App.current_user.set('department', 'department');
App.current_user.set('roles', ['admin']);
App.current_user.set('photo_url', null);
