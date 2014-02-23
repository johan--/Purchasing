
App.PersonTokenInput = Ember.TextField.extend({

  controller: 'purchase',
  modelName: null,
  updateAccounts: false,

  didInsertElement: function() {
    var modelName = this.get('modelName'),
        token = [];
    token.push(this.get('targetObject').get(modelName));
    this.initTokenInput(token);
  },


  initTokenInput: function(token) {
    var modelName = this.get('modelName'),
        self = this;

    if (isEmpty(token) || isEmpty(token[0]))
      token = null;

    this.$().tokenInput(App.getUrl('/users/tokens.json'), {
      crossDomain: false,
      minChars: 2,
      preventDuplicates: true,
      theme: 'large',
      tokenLimit: 1,
      hintText: 'Search for a ' + modelName,
      propertyToSearch: 'displayname',

      onAdd: function(val) {
        self.addToken(val);
      },
      onDelete: function(val) {
        self.removeToken(val);
      },
      prePopulate: token
    });
  },


  addToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(modelName, token);

    // Only refresh tokens if they need it
    if (!token.id)
      this._refreshToken(token);
  },


  removeToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(modelName, null);
    this.get('targetObject.model').send('becomeDirty');
  },


  willDestroyElement: function() {
    this.$().tokenInput('destroy');
    $('.token-input-dropdown-large').remove();
  },


  _refreshToken: function(userToken) {
    Ember.assert('You must send a user token to retrieve accounts for a user', !!userToken);
    // This not only retrieves accounts for a user, but also replaces the active token with one that
    // has server values and not API values

    var self = this,
        updateAccounts = this.get('updateAccounts'),
        tokenInput = this.$(),
        store = this.get('targetObject.store'),
        modelName = this.get('modelName');

    $.ajax({
      url: App.getUrl('/users/account_tokens'),
      method: 'POST',
      data: { user: userToken } // Send entire token so server can update its records
    }).then(function(data) {
      Ember.run(function() {

        Ember.assert('Server did not respond with data', !!data);
        Ember.assert('Server did not respond with the user token', !!data.user);

        if (data && data.user) {
          var newToken = data.user;

          // Manually add token to avoid infinite loops
          self.get('targetObject').set(modelName, newToken);

          // Replace current token
          tokenInput.tokenInput('clear');
          tokenInput.tokenInput('add', newToken);
        }

        if (updateAccounts && data && data.accounts) {
          store.unloadAll(App.Account);
          store.pushMany('account', data.accounts);
        }
      });
    });
  }
});
