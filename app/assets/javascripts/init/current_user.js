
$(function() {

  if (!App.testing)
    App.current_user.initUser();

});


// Current User Object
App.current_user = Ember.Object.create({
});

App.current_user.reopen({
  initUser: function() {
    var self = this;

    if (Ember.testing)
      return;

    $.ajax('/users/current').then(function(data) {

      self.set('id', data.id);
      self.set('username', data.username);
      self.set('name', data.name);
      self.set('email', data.email);
      self.set('phone', data.phone);
      self.set('department', data.department);
      self.set('roles', data.roles);
      self.set('photo_url', data.photo_url);

    });
  },


  first_name: function() {
    var name = this.get('name');

    if (name) {
      var name_arr = name.split(' ');
      return name_arr[0];
    }
  }.property('name'),


  is_buyer: function() {
    var roles = this.get('roles'),
        admin = this.get('is_manager') || this.get('is_admin');

    if (roles || admin)
      return (roles.indexOf('buyer') > -1) || admin;
  }.property('roles', 'is_manager', 'is_admin'),


  is_receiver: function() {
    var roles = this.get('roles'),
        admin = this.get('is_manager') || this.get('is_admin');

    if (roles || admin)
      return (roles.indexOf('receiver') > -1) || admin;
  }.property('roles', 'is_manager', 'is_admin'),


  is_buyer_or_receiver: function() {
    return this.get('is_buyer') || this.get('is_receiver');
  }.property('is_buyer', 'is_receiver'),


  is_manager: function() {
    var roles = this.get('roles'),
        admin = this.get('is_admin');

    if (roles || admin)
      return (roles.indexOf('manager') > -1) || admin;
  }.property('roles', 'is_admin'),


  is_admin: function() {
    var roles = this.get('roles');

    if (roles)
      return (roles.indexOf('admin') > -1) || (roles.indexOf('developer') > -1);
  }.property('roles'),
});
