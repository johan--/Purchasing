App.UserController = Ember.ObjectController.extend({
  needs: 'application',
  applicationBinding: "controllers.application",

  emailLink: function() {
    var email = this.get('email');

    if (email.indexOf('mailto://') > -1)
      return email;
    else
      return 'mailto://' + email;
  }.property('email'),

  actions: {
    close: function(){
      this.get('model').rollback();
      return this.send('closeModal');
    },

    openRecord: function(element) {
      var record = this.get('model');
      this.send('openModal', 'User', 'users/edit', record, element);
      return false;
    }
  }

})
