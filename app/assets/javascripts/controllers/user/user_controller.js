
App.UserController = Ember.ObjectController.extend({

  emailLink: function() {
    var email = this.get('email');

    if (email) {
      if (email.indexOf('mailto://') > -1)
        return email;
      else
        return 'mailto://' + email;
    }
  }.property('email'),


  actions: {

    openRecord: function(element) {
      var record = this.get('model');
      this.send('openModal', 'UsersAccounts', 'users/edit', record, element);
      return false;
    }
  }
});
